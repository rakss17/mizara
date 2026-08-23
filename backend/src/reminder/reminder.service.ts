import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { format, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { ReminderSettingsModel } from './models/reminder-settings.model';
import { SentReminderModel } from './models/sent-reminder.model';
import { ReminderChannel, ReminderOffsetDays } from '@/common/enum';

const REMINDER_TIMEZONE = 'Asia/Manila';

@Injectable()
export class ReminderService {
    private readonly logger = new Logger(ReminderService.name);

    constructor(
        @InjectModel(RecurringPaymentModel)
        private recurringPaymentModel: typeof RecurringPaymentModel,
        @InjectModel(SentReminderModel)
        private sentReminderModel: typeof SentReminderModel,
    ) {}

    async findDueReminders() {
        this.logger.log(`Finding due reminders...`);

        const recurringPayments = await this.recurringPaymentModel.findAll({
            attributes: ['id', 'name', 'amount', 'due_date'],
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

        const dueReminders: {
            recurringPayment: RecurringPaymentModel;
            offsetDays: ReminderOffsetDays;
        }[] = [];

        for (const recurringPayment of recurringPayments) {
            const dueDate = toZonedTime(
                recurringPayment.due_date,
                REMINDER_TIMEZONE,
            );
            const remindBeforeDays =
                recurringPayment.reminder_settings?.remind_before_days ?? [];

            for (const offsetDays of remindBeforeDays) {
                // due_date's time-of-day is preserved, so the reminder fires
                // once "now" reaches the same time-of-day, offsetDays earlier.
                const reminderInstant = subDays(dueDate, offsetDays);
                const isDue = reminderInstant <= now;
                const key = `${recurringPayment.id}:${offsetDays}`;

                if (isDue && !alreadySentKeys.has(key)) {
                    dueReminders.push({ recurringPayment, offsetDays });
                }
            }
        }

        this.logger.log(`Found ${dueReminders.length} due reminder(s)`);

        return dueReminders;
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
