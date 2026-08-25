import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { ReminderOffsetDays } from '@/common/enum';

export interface DueReminder {
    recurringPayment: RecurringPaymentModel;
    offsetDays: ReminderOffsetDays;
    timezone: string;
}
