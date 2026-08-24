import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import * as bcrypt from 'bcrypt';

import { UserModel } from '@/user/models/user.model';
import { UserStatus } from '@/common/enum';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel,
        @InjectConnection()
        private readonly sequelize: Sequelize,
    ) {}

    async create(
        first_name: string,
        last_name: string,
        email: string,
        password: string,
        transaction: Transaction,
    ) {
        try {
            this.logger.log(`Creating user with email: ${email}`);

            const hashedPassword = await bcrypt.hash(password, 12);

            const createdUser = await this.userModel.create(
                {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                },
                { transaction },
            );

            this.logger.log(
                `Successfully created user with email: ${createdUser.email}`,
            );
            return {
                message: 'Successfully created user',
                data: { id: createdUser.id, email: createdUser.email },
            };
        } catch (error) {
            this.logger.error(
                `Error creating user with email: ${email}`,
                error,
            );
            throw error;
        }
    }

    async validateCredentials(email: string, password: string) {
        try {
            this.logger.log(
                `Validating credentials for user with email: ${email}`,
            );

            const user = await this.findByEmail(email);

            if (!user) {
                this.logger.warn(
                    `Credential validation failed for email: ${email} - User not found`,
                );
                return null;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                this.logger.warn(
                    `Credential validation failed for email: ${email} - Invalid password`,
                );
                return null;
            }

            if (!user.is_email_verified) {
                this.logger.warn(
                    `Credential validation failed for email: ${email} - User email is not yet verified`,
                );
                return {
                    message: `User email is not yet verified: ${email}`,
                    data: { status: UserStatus.Unverified },
                };
            }

            this.logger.log(`Credentials validated for email: ${user.email}`);
            return {
                message: 'Credentials validated successfully',
                data: { id: user.id, email: user.email },
            };
        } catch (error) {
            this.logger.error(
                `Error validating credentials for email: ${email}`,
                error,
            );
            throw error;
        }
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ where: { email } });
    }

    async findById(id: string) {
        return this.userModel.findOne({
            attributes: ['id', 'email', 'first_name', 'last_name'],
            where: { id },
        });
    }
}
