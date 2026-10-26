import { NotificationType } from '@/common/enum';

export interface CreateNotification {
    user_id: string;
    recurring_payment_id?: string | null;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, unknown> | null;
}
