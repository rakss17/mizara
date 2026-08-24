import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { toZonedTime } from 'date-fns-tz';

import { ReminderService } from './reminder.service';
import { UserService } from '@/user/user.service';
import { EmailService } from '@/email/email.service';
import { ReminderChannel } from '@/common/enum';

@Injectable()
export class ReminderSchedulerService {
    private readonly logger = new Logger(ReminderSchedulerService.name);

    constructor(
        private readonly reminderService: ReminderService,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async handleReminders() {
        this.logger.log(
            'Running cron job for recurring payment due reminders...',
        );

        const dueReminders = await this.reminderService.findDueReminders();

        for (const dueReminder of dueReminders) {
            const userId = dueReminder.recurringPayment.user_id;
            const foundUser = await this.userService.findById(userId);

            if (!foundUser) {
                this.logger.warn(
                    `User not found for recurring payment: ${dueReminder.recurringPayment.id} - cron job not completed.`,
                );
                return;
            }

            const reminderChannels =
                dueReminder.recurringPayment.reminder_settings?.channels ?? [];

            for (const reminderChannel of reminderChannels) {
                this.logger.log(
                    `Sending reminder to user: ${foundUser.email} via ${reminderChannel}`,
                );

                const dueDate = toZonedTime(
                    dueReminder.recurringPayment.due_date,
                    dueReminder.timezone,
                );

                if (reminderChannel === ReminderChannel.Email) {
                    await this.emailService.sendDueReminder(
                        foundUser.email,
                        foundUser.first_name,
                        dueReminder.recurringPayment.name,
                        String(dueReminder.recurringPayment.amount),
                        dueDate,
                        dueReminder.offsetDays,
                    );
                }

                await this.reminderService.recordSent(
                    dueReminder.recurringPayment.id,
                    dueReminder.offsetDays,
                    reminderChannel,
                );
                this.logger.log(
                    `Successfully sent reminder to user: ${foundUser.email} via ${reminderChannel}`,
                );
            }
        }

        this.logger.log(
            'Completed cron job for recurring payment due reminders',
        );
    }
}
