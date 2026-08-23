import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReminderService } from './reminder.service';

@Injectable()
export class ReminderSchedulerService {
    private readonly logger = new Logger(ReminderSchedulerService.name);

    constructor(private readonly reminderService: ReminderService) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async handleReminders() {
        this.logger.log('Running cron job for recurring payment reminders...');

        await this.reminderService.findDueReminders();

        this.logger.log('Completed cron job for recurring payment reminders');
    }
}
