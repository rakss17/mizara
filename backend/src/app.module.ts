import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { EmailModule } from '@/email/email.module';
import { RecurringPaymentModule } from './recurring-payment/recurring-payment.module';
import { ReminderModule } from './reminder/reminder.module';
import { CategoryModule } from './category/category.module';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            useFactory: (configService: ConfigService) => ({
                dialect: 'postgres',
                uri: configService.get<string>('DATABASE_URL'),
                autoLoadModels: true,
                synchronize: false,
                logging: false,
                timezone: 'UTC',
            }),
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        UserModule,
        EmailModule,
        RecurringPaymentModule,
        ReminderModule,
        CategoryModule,
    ],
})
export class AppModule {}
