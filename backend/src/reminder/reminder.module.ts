import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ReminderSettingsModel } from './models/reminder-settings.model';
import { SentReminderModel } from './models/sent-reminder.model';
import { ReminderSettingsService } from './reminder-settings.service';
import { ReminderSettingsController } from './reminder-settings.controller';
import { RecurringPaymentModule } from '@/recurring-payment/recurring-payment.module';
import { ReminderSchedulerService } from './reminder-scheduler.service';
import { ReminderService } from './reminder.service';
import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';

@Module({
    imports: [
        SequelizeModule.forFeature([
            ReminderSettingsModel,
            SentReminderModel,
            RecurringPaymentModel,
        ]),
        RecurringPaymentModule,
    ],
    controllers: [ReminderSettingsController],
    providers: [
        ReminderService,
        ReminderSettingsService,
        ReminderSchedulerService,
    ],
})
export class ReminderModule {}
