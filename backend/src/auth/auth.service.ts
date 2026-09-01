import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { Sequelize, Transaction } from 'sequelize';

import { UserService } from '@/user/user.service';
import { UserStatus } from '@/common/enum';
import { VerificationCodeModel } from '@/auth/models/verification-code.model';
import { EmailService } from '@/email/email.service';
import { VerificationCodeType } from '@/common/enum';
import { ChangeEmailDto } from '@/auth/dto/change-email.dto';
import { VerifyChangeEmailDto } from './dto/verify-change-email.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        @InjectModel(VerificationCodeModel)
        private readonly verificationCodeModel: typeof VerificationCodeModel,
        @InjectConnection()
        private readonly sequelize: Sequelize,
    ) {}

    async signup(
        first_name: string,
        last_name: string,
        email: string,
        password: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(`Signing up user with email: ${email}`);

            const user = await this.userService.findByEmail(email);
            if (user) {
                this.logger.warn(`User already exists with email: ${email}`);
                throw new BadRequestException(
                    `User with email ${email} already exists`,
                );
            }

            const createdUser = await this.userService.create(
                first_name,
                last_name,
                email,
                password,
                transaction,
            );

            await this.createAndSendVerificationCode(
                createdUser.data.id,
                email,
                VerificationCodeType.EmailVerification,
                transaction,
            );

            await transaction.commit();

            this.logger.log(
                `User signed up successfully with email: ${createdUser.data.email}`,
            );

            return {
                message: `User ${createdUser.data.email} signed up successfully. Please check your email for the verification code.`,
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(
                `Error signing up user with email: ${email}`,
                error,
            );
            throw error;
        }
    }

    async signin(email: string, password: string) {
        this.logger.log(`Signing in user with email: ${email}`);

        const validatedUser = await this.userService.validateCredentials(
            email,
            password,
        );

        if (!validatedUser) {
            this.logger.warn(`Invalid email or password for email: ${email}`);
            throw new BadRequestException('Invalid email or password');
        }

        if (validatedUser.data.status === UserStatus.Unverified) {
            this.logger.warn(
                `User email is not yet verified for email: ${email}`,
            );
            throw new BadRequestException('Email is not yet verified');
        }

        const payload = {
            sub: validatedUser.data.id,
            email: validatedUser.data.email,
        };

        const accessToken = this.jwtService.sign(payload);

        this.logger.log(
            `User signed in successfully with email: ${validatedUser.data.email}`,
        );

        return {
            message: `User ${validatedUser.data.email} signed in successfully`,
            data: { accessToken },
        };
    }

    private async createAndSendVerificationCode(
        userId: string,
        email: string,
        verificationType: VerificationCodeType,
        transaction: Transaction,
    ) {
        this.logger.log(`Creating ${verificationType} code for user: ${email}`);
        const code = randomInt(100000, 1000000).toString();

        const codeHash = await bcrypt.hash(code, 10);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.verificationCodeModel.create(
            {
                user_id: userId,
                email: email,
                code_hash: codeHash,
                expires_at: expiresAt,
                attempts: 0,
                type: verificationType,
            },
            { transaction },
        );

        this.logger.log(`${verificationType} code created for user: ${email}`);

        if (verificationType === VerificationCodeType.EmailVerification) {
            await this.emailService.sendEmailVerificationCode(email, code);
        } else if (verificationType === VerificationCodeType.PasswordReset) {
            await this.emailService.sendPasswordResetCode(email, code);
        } else if (verificationType === VerificationCodeType.ChangeEmail) {
            await this.emailService.sendChangeEmailVerificationCode(
                email,
                code,
            );
        }

        this.logger.log(`${verificationType} code sent to user: ${email}`);
    }

    private async enforceResendCooldown(
        userId: string,
        type: VerificationCodeType,
    ) {
        const latestVerification = await this.verificationCodeModel.findOne({
            where: { user_id: userId, type },
            order: [['created_at', 'DESC']],
        });

        if (!latestVerification) {
            return;
        }

        const cooldown = Date.now() - latestVerification.created_at.getTime();

        if (cooldown < 60 * 1000) {
            this.logger.warn(
                `${type} code requested too soon for user: ${userId}`,
            );
            throw new BadRequestException(
                'Please wait before requesting another code.',
            );
        }
    }

    private async validateVerificationCode(
        userId: string,
        type: VerificationCodeType,
        code: string,
    ): Promise<VerificationCodeModel> {
        const verification = await this.verificationCodeModel.findOne({
            where: {
                user_id: userId,
                type,
                used_at: null,
            },
            order: [['created_at', 'DESC']],
        });

        if (!verification) {
            this.logger.warn(
                `No active ${type} code found for user: ${userId}`,
            );
            throw new BadRequestException(
                'Invalid or expired verification code.',
            );
        }

        if (verification.expires_at.getTime() < Date.now()) {
            this.logger.warn(`${type} code expired for user: ${userId}`);
            throw new BadRequestException('Verification code has expired.');
        }

        if (verification.attempts >= 5) {
            this.logger.warn(
                `Too many attempts for ${type} code, user: ${userId}`,
            );
            throw new BadRequestException(
                'Too many attempts. Please request a new verification code.',
            );
        }

        const isValid = await bcrypt.compare(code, verification.code_hash);

        if (!isValid) {
            this.logger.warn(`Invalid ${type} code for user: ${userId}`);
            await verification.increment('attempts');
            throw new BadRequestException('Invalid verification code.');
        }

        return verification;
    }

    async verifyEmail(email: string, code: string) {
        this.logger.log(`Verifying email for user: ${email}`);

        const user = await this.userService.findByEmail(email);

        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            throw new NotFoundException('User not found.');
        }

        if (user.is_email_verified) {
            this.logger.warn(`Email already verified for user: ${email}`);
            throw new BadRequestException('Email is already verified.');
        }

        const verification = await this.validateVerificationCode(
            user.id,
            VerificationCodeType.EmailVerification,
            code,
        );

        const transaction = await this.sequelize.transaction();

        try {
            user.is_email_verified = true;

            await user.save({
                transaction,
            });

            verification.used_at = new Date();

            await verification.save({
                transaction,
            });

            await transaction.commit();

            this.logger.log(`Email verified successfully for user: ${email}`);

            return {
                message: 'Email verified successfully.',
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(
                `Error verifying email for user: ${email}`,
                error,
            );
            throw error;
        }
    }

    async resendVerificationCode(email: string) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(`Resending verification code for user: ${email}`);
            const user = await this.userService.findByEmail(email);

            if (!user) {
                this.logger.warn(`User not found for email: ${email}`);
                throw new NotFoundException('User not found.');
            }

            if (user.is_email_verified) {
                this.logger.warn(
                    `Email is already verified for user: ${email}`,
                );
                throw new BadRequestException('Email is already verified.');
            }

            await this.enforceResendCooldown(
                user.id,
                VerificationCodeType.EmailVerification,
            );

            await this.createAndSendVerificationCode(
                user.id,
                user.email,
                VerificationCodeType.EmailVerification,
                transaction,
            );

            await transaction.commit();

            this.logger.log(`Verification code resent for user: ${email}`);

            return {
                message: `A new verification code has been sent to ${user.email}`,
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(
                `Error resending verification code for user: ${email}`,
                error,
            );
            throw error;
        }
    }

    async forgotPassword(email: string) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(`Processing forgot password for user: ${email}`);
            const user = await this.userService.findByEmail(email);

            if (!user) {
                this.logger.warn(`User not found for email: ${email}`);
                throw new NotFoundException('User not found.');
            }

            await this.enforceResendCooldown(
                user.id,
                VerificationCodeType.PasswordReset,
            );

            await this.createAndSendVerificationCode(
                user.id,
                user.email,
                VerificationCodeType.PasswordReset,
                transaction,
            );

            await transaction.commit();

            this.logger.log(`Forgot password code sent for user: ${email}`);

            return {
                message: `A password reset code has been sent to ${user.email}`,
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(
                `Error processing forgot password for user: ${email}`,
                error,
            );
            throw error;
        }
    }

    async verifyPasswordResetCode(email: string, code: string) {
        this.logger.log(`Verifying password reset code for user: ${email}`);

        const user = await this.userService.findByEmail(email);

        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            throw new NotFoundException('User not found.');
        }

        await this.validateVerificationCode(
            user.id,
            VerificationCodeType.PasswordReset,
            code,
        );

        this.logger.log(`Password reset code verified for user: ${email}`);

        return {
            message: 'Password reset code verified successfully.',
        };
    }

    async resetPassword(email: string, code: string, new_password: string) {
        this.logger.log(`Resetting password for user: ${email}`);

        const user = await this.userService.findByEmail(email);

        if (!user) {
            this.logger.warn(`User not found for email: ${email}`);
            throw new NotFoundException('User not found.');
        }

        const verification = await this.validateVerificationCode(
            user.id,
            VerificationCodeType.PasswordReset,
            code,
        );

        const transaction = await this.sequelize.transaction();

        try {
            user.password = await bcrypt.hash(new_password, 12);
            await user.save({ transaction });

            verification.used_at = new Date();
            await verification.save({ transaction });

            await transaction.commit();

            this.logger.log(`Password reset successfully for user: ${email}`);

            return {
                message: 'Password has been reset successfully.',
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(
                `Error resetting password for user: ${email}`,
                error,
            );
            throw error;
        }
    }

    async changeEmail(currentEmail: string, dto: ChangeEmailDto) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(`Changing email for user: ${currentEmail}`);

            const user = await this.userService.findByEmail(currentEmail);

            if (!user) {
                this.logger.warn(`User not found for email: ${currentEmail}`);
                throw new NotFoundException('User not found.');
            }

            if (
                user.email.toLocaleLowerCase() ===
                dto.new_email.toLocaleLowerCase()
            ) {
                this.logger.warn(
                    `New email is the same as current email for user: ${currentEmail}`,
                );
                throw new BadRequestException(
                    'New email cannot be the same as the current email.',
                );
            }

            const isPasswordValid = await bcrypt.compare(
                dto.password,
                user.password,
            );

            if (!isPasswordValid) {
                this.logger.warn(
                    `Invalid password provided for user: ${currentEmail}`,
                );
                throw new BadRequestException('Invalid password.');
            }

            const existingUser = await this.userService.findByEmail(
                dto.new_email,
            );

            if (existingUser) {
                this.logger.warn(`Email already in use: ${dto.new_email}`);
                throw new BadRequestException('Email is already in use.');
            }

            await this.createAndSendVerificationCode(
                user.id,
                dto.new_email,
                VerificationCodeType.ChangeEmail,
                transaction,
            );

            await transaction.commit();

            this.logger.log(
                `Change email verification code sent to new email: ${dto.new_email}`,
            );

            return {
                message: `A verification code has been sent to ${dto.new_email}. Please verify to complete the email change.`,
            };
        } catch (error) {
            await transaction.rollback();

            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }

            this.logger.error(
                `Error changing email for user: ${currentEmail}`,
                error,
            );
            throw error;
        }
    }

    async verifyChangeEmail(currentEmail: string, dto: VerifyChangeEmailDto) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Verifying change email code for user: ${currentEmail}`,
            );

            const user = await this.userService.findByEmail(currentEmail);

            if (!user) {
                this.logger.warn(`User not found for email: ${currentEmail}`);
                throw new NotFoundException('User not found.');
            }

            const verification = await this.validateVerificationCode(
                user.id,
                VerificationCodeType.ChangeEmail,
                dto.code,
            );

            await user.update(
                { email: verification.email, is_email_verified: true },
                { transaction },
            );

            await verification.update({ used_at: new Date() }, { transaction });

            await transaction.commit();

            const payload = {
                sub: user.id,
                email: verification.email,
            };

            const newAccessToken = this.jwtService.sign(payload);

            this.logger.log(
                `Email changed successfully for user: ${currentEmail}`,
            );

            return {
                message: 'Email has been changed successfully.',
                data: { newAccessToken: newAccessToken },
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error verifying email change for user: ${currentEmail}`,
                error,
            );
            throw error;
        }
    }
}
