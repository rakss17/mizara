import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { RecurringPaymentBillingCycle } from '@/common/enum';

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);

    constructor(
        @InjectModel(RecurringPaymentModel)
        private recurringPaymentModel: typeof RecurringPaymentModel,
    ) {}

    async getOverview(currentUserId: string, currentUserEmail: string) {
        try {
            this.logger.log(
                `Fetching dashboard overview for user: ${currentUserEmail}`,
            );

            const recurringPayments = await this.recurringPaymentModel.findAll({
                where: {
                    user_id: currentUserId,
                    is_archived: false,
                },
            });

            const now = new Date();

            // Start of today
            const startOfToday = new Date(now);
            startOfToday.setHours(0, 0, 0, 0);

            // 7 days from today
            const endOfUpcomingPeriod = new Date(startOfToday);
            endOfUpcomingPeriod.setDate(endOfUpcomingPeriod.getDate() + 7);
            endOfUpcomingPeriod.setHours(23, 59, 59, 999);

            const upcomingPayments = recurringPayments
                .filter((payment) => {
                    const dueDate = new Date(payment.due_date);

                    return (
                        dueDate >= startOfToday &&
                        dueDate <= endOfUpcomingPeriod
                    );
                })
                .sort(
                    (a, b) =>
                        new Date(a.due_date).getTime() -
                        new Date(b.due_date).getTime(),
                );

            // Free trials ending within the next 7 days
            const freeTrialsEnding = recurringPayments.filter((payment) => {
                if (!payment.is_free_trial) {
                    return false;
                }

                const dueDate = new Date(payment.due_date);

                return (
                    dueDate >= startOfToday && dueDate <= endOfUpcomingPeriod
                );
            });

            // Calculate estimated monthly spending
            const totalMonthlySpending = recurringPayments.reduce(
                (total, payment) => {
                    const amount = Number(payment.amount);

                    switch (payment.billing_cycle) {
                        case RecurringPaymentBillingCycle.Weekly:
                            return total + (amount * 52) / 12;

                        case RecurringPaymentBillingCycle.Monthly:
                            return total + amount;

                        case RecurringPaymentBillingCycle.Quarterly:
                            return total + amount / 3;

                        case RecurringPaymentBillingCycle.Yearly:
                            return total + amount / 12;

                        default:
                            return total;
                    }
                },
                0,
            );

            this.logger.log(
                `Fetched dashboard overview successfully for user: ${currentUserEmail}`,
            );

            return {
                message: 'Fetched dashboard overview successfully.',
                data: {
                    total: String(recurringPayments.length),
                    total_upcoming_this_week: String(upcomingPayments.length),
                    free_trials_ending: String(freeTrialsEnding.length),
                    total_monthly_spending: `P${totalMonthlySpending.toFixed(2)}`, // TODO: replace with actual currency sign
                    upcoming_due: upcomingPayments.map((payment) => ({
                        id: payment.id,
                        name: payment.name,
                        type: payment.type,
                        amount: Number(payment.amount),
                        currency: payment.currency,
                        due_date: payment.due_date,
                        icon: payment.icon,
                    })),
                },
            };
        } catch (error) {
            this.logger.error(
                `Error fetching dashboard overview for user: ${currentUserEmail}`,
            );

            throw error;
        }
    }
}
