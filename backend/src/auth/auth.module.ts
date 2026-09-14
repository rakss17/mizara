import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { UserModule } from '@/user/user.module';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { VerificationCodeModel } from '@/auth/models/verification-code.model';
import { RefreshTokenModel } from '@/auth/models/refresh-token.model';
import { EmailModule } from '@/email/email.module';

const ACCESS_TOKEN_EXPIRES_IN = (process.env.JWT_ACCESS_EXPIRES_IN ??
    '15m') as JwtSignOptions['expiresIn'];

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
        }),
        SequelizeModule.forFeature([VerificationCodeModel, RefreshTokenModel]),
        EmailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
