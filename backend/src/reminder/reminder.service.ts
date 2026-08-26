import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { format, isSameDay, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { ReminderSettingsModel } from './models/reminder-settings.model';
import { SentReminderModel } from './models/sent-reminder.model';
import { ReminderChannel, ReminderOffsetDays } from '@/common/enum';
import { DueReminder } from './types/due-reminder.type';
import { UserService } from '@/user/user.service';
import { EmailService } from '@/email/email.service';

// TODO: real-user timezone is coming from the user settings
const REMINDER_TIMEZONE = 'Asia/Manila';

@Injectable()
export class ReminderService {
    private readonly logger = new Logger(ReminderService.name);

    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        @InjectModel(RecurringPaymentModel)
        private recurringPaymentModel: typeof RecurringPaymentModel,
        @InjectModel(SentReminderModel)
        private sentReminderModel: typeof SentReminderModel,
    ) {}

    async findDueReminders() {
        this.logger.log(`Finding due reminders...`);

        const recurringPayments = await this.recurringPaymentModel.findAll({
            attributes: ['id', 'name', 'amount', 'due_date', 'user_id'],
            where: { is_archived: false },
            include: [
                {
                    model: ReminderSettingsModel,
                    as: 'reminder_settings',
                    required: true,
                    where: { is_enabled: true },
                },
            ],
        });

        const now = toZonedTime(new Date(), REMINDER_TIMEZONE);
        const todayDateOnly = format(now, 'yyyy-MM-dd');

        const alreadySent = await this.sentReminderModel.findAll({
            attributes: ['recurring_payment_id', 'offset_days'],
            where: { reminder_date: todayDateOnly },
        });
        const alreadySentKeys = new Set(
            alreadySent.map(
                (sentReminder) =>
                    `${sentReminder.recurring_payment_id}:${sentReminder.offset_days}`,
            ),
        );

        const dueReminders: DueReminder[] = [];

        for (const recurringPayment of recurringPayments) {
            const dueDate = toZonedTime(
                recurringPayment.due_date,
                REMINDER_TIMEZONE,
            );
            const remindBeforeDays =
                recurringPayment.reminder_settings?.remind_before_days ?? [];

            for (const offsetDays of remindBeforeDays) {
                // due_date's time-of-day is preserved, so within the target
                // day the reminder only fires once "now" reaches it. Once
                // the target day has passed, it's skipped, not backfilled.
                const reminderInstant = subDays(dueDate, offsetDays);
                const isDue =
                    isSameDay(reminderInstant, now) && reminderInstant <= now;
                const key = `${recurringPayment.id}:${offsetDays}`;

                if (isDue && !alreadySentKeys.has(key)) {
                    dueReminders.push({
                        recurringPayment,
                        offsetDays,
                        timezone: REMINDER_TIMEZONE,
                    });
                }
            }
        }

        this.logger.log(`Found ${dueReminders.length} due reminder(s)`);

        return dueReminders;
    }

    async sendDueReminders(dueReminders: DueReminder[]) {
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
                    if (dueReminder.recurringPayment.is_free_trial) {
                        await this.emailService.sendFreeTrialReminder(
                            foundUser.email,
                            foundUser.first_name,
                            dueReminder.recurringPayment.name,
                            String(dueReminder.recurringPayment.amount),
                            dueDate,
                            dueReminder.offsetDays,
                            dueReminder.recurringPayment.billing_cycle
                        );
                    } else {
                        await this.emailService.sendDueReminder(
                            foundUser.email,
                            foundUser.first_name,
                            dueReminder.recurringPayment.name,
                            String(dueReminder.recurringPayment.amount),
                            dueDate,
                            dueReminder.offsetDays,
                        );
                    }
                }

                await this.recordSent(
                    dueReminder.recurringPayment.id,
                    dueReminder.offsetDays,
                    reminderChannel,
                );
                this.logger.log(
                    `Successfully sent reminder to user: ${foundUser.email} via ${reminderChannel}`,
                );
            }
        }
    }

    async recordSent(
        recurringPaymentId: string,
        offsetDays: ReminderOffsetDays,
        channel: ReminderChannel,
    ) {
        const today = toZonedTime(new Date(), REMINDER_TIMEZONE);
        const todayDateOnly = format(today, 'yyyy-MM-dd');

        await this.sentReminderModel.create({
            recurring_payment_id: recurringPaymentId,
            offset_days: offsetDays,
            channel,
            reminder_date: todayDateOnly,
        });
    }
}
