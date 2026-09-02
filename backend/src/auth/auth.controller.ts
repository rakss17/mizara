import {
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '@/auth/auth.service';
import { SignupDto } from '@/auth/dto/signup.dto';
import { SigninDto } from '@/auth/dto/signin.dto';
import { VerifyEmailDto } from '@/auth/dto/verify-email.dto';
import { ResendVerificationCodeDto } from '@/auth/dto/resend-verification.dto';
import { ForgotPasswordDto } from '@/auth/dto/forgot-password.dto';
import { VerifyPasswordResetCodeDto } from '@/auth/dto/verify-password-reset-code.dto';
import { ResetPasswordDto } from '@/auth/dto/reset-password.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { ChangeEmailDto } from '@/auth/dto/change-email.dto';
import { ChangePasswordDto } from '@/auth/dto/change-password.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '@/auth/types/authenticated-user.type';
import { VerifyChangeEmailDto } from './dto/verify-change-email.dto';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(
            signupDto.first_name,
            signupDto.last_name,
            signupDto.email,
            signupDto.password,
        );
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto.email, signinDto.password);
    }

    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(
            verifyEmailDto.email,
            verifyEmailDto.code,
        );
    }

    @Post('resend-verification-code')
    @HttpCode(HttpStatus.OK)
    async resendVerificationCode(@Body() dto: ResendVerificationCodeDto) {
        return this.authService.resendVerificationCode(dto.email);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto.email);
    }

    @Post('verify-password-reset-code')
    @HttpCode(HttpStatus.OK)
    async verifyPasswordResetCode(@Body() dto: VerifyPasswordResetCodeDto) {
        return this.authService.verifyPasswordResetCode(dto.email, dto.code);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(
            dto.email,
            dto.code,
            dto.new_password,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-email')
    @HttpCode(HttpStatus.OK)
    async changeEmail(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: ChangeEmailDto,
    ) {
        return this.authService.changeEmail(user.email, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('verify-change-email')
    @HttpCode(HttpStatus.OK)
    async verifyChangeEmail(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: VerifyChangeEmailDto,
    ) {
        return this.authService.verifyChangeEmail(user.email, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: ChangePasswordDto,
    ) {
        return this.authService.changePassword(user.email, dto);
    }
}
