import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReminderSchedulerService {
    private readonly logger = new Logger(ReminderSchedulerService.name);

    @Cron(CronExpression.EVERY_MINUTE)
    async handleReminders() {
        this.logger.log('Checking for due reminders...');
    }
}
