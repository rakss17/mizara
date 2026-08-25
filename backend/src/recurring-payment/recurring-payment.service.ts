import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { addMonths, addQuarters, addWeeks, addYears, format } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { CreateRecurringPaymentDto } from '@/recurring-payment/dto/create-recurring-payment.dto';
import { FindAllRecurringPaymentDto } from '@/recurring-payment/dto/find-all-recurring-payment.dto';
import { UpdateRecurringPaymentDto } from '@/recurring-payment/dto/update-recurring-payment.dto';
import {
    RecurringPaymentBillingCycle,
    RecurringPaymentSortBy,
    SortOrder,
} from '@/common/enum';

// TODO: real-user timezone is coming from the user settings
const RECURRING_PAYMENT_TIMEZONE = 'Asia/Manila';

@Injectable()
export class RecurringPaymentService {
    private readonly logger = new Logger(RecurringPaymentService.name);

    constructor(
        @InjectModel(RecurringPaymentModel)
        private recurringPaymentModel: typeof RecurringPaymentModel,
        @InjectConnection()
        private readonly sequelize: Sequelize,
    ) {}

    async create(
        dto: CreateRecurringPaymentDto,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Creating recurring payment for user: ${currentUserEmail}`,
            );

            const createdRecurringPayment =
                await this.recurringPaymentModel.create(
                    {
                        user_id: currentUserId,
                        name: dto.name,
                        type: dto.type,
                        description: dto.description,
                        amount: dto.amount,
                        currency: dto.currency,
                        billing_cycle: dto.billing_cycle,
                        due_date: new Date(dto.due_date),
                        is_auto_renew: dto.is_auto_renew,
                        is_archived: dto.is_archived,
                        is_free_trial: dto.is_free_trial,
                        icon: dto.icon,
                    },
                    { transaction },
                );

            await transaction.commit();

            this.logger.log(
                `Successfully created recurring payment for user: ${currentUserEmail}`,
            );

            return {
                message: 'Successfully created recurring payment',
                data: { id: createdRecurringPayment.id },
            };
        } catch (error) {
            await transaction.rollback();

            this.logger.error(
                `Error creating recurring payment for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    async findAll(
        currentUserId: string,
        currentUserEmail: string,
        query: FindAllRecurringPaymentDto,
    ) {
        try {
            this.logger.log(
                `Fetching recurring payments for user: ${currentUserEmail}`,
            );

            const page = query.page ?? 1;
            const limit = query.limit ?? 10;
            const sortBy = query.sort_by ?? RecurringPaymentSortBy.DueDate;
            const sortOrder = query.sort_order ?? SortOrder.ASC;

            const { rows, count } =
                await this.recurringPaymentModel.findAndCountAll({
                    where: {
                        user_id: currentUserId,
                        ...(query.type !== undefined && { type: query.type }),
                        ...(query.is_archived !== undefined && {
                            is_archived: query.is_archived,
                        }),
                        ...(query.is_auto_renew !== undefined && {
                            is_auto_renew: query.is_auto_renew,
                        }),
                        ...(query.is_free_trial !== undefined && {
                            is_free_trial: query.is_free_trial,
                        }),
                        ...(query.search && {
                            [Op.or]: [
                                { name: { [Op.iLike]: `%${query.search}%` } },
                                {
                                    description: {
                                        [Op.iLike]: `%${query.search}%`,
                                    },
                                },
                            ],
                        }),
                    },
                    limit,
                    offset: (page - 1) * limit,
                    order: [[sortBy, sortOrder]],
                });

            this.logger.log(
                `Fetched recurring payments successfully for user: ${currentUserEmail}`,
            );

            return {
                message: 'Fetched recurring payments successfully',
                data: rows,
                metadata: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit),
                },
            };
        } catch (error) {
            this.logger.error(
                `Error fetching recurring payments for user: ${currentUserEmail}`,
            );

            throw error;
        }
    }

    async update(
        id: string,
        dto: UpdateRecurringPaymentDto,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Updating recurring payment ${id} for user: ${currentUserEmail}`,
            );

            const recurringPayment = await this.recurringPaymentModel.findOne({
                where: { id, user_id: currentUserId },
                transaction,
            });

            if (!recurringPayment) {
                this.logger.warn(
                    `Recurring payment ${id} not found for user: ${currentUserEmail}`,
                );
                throw new NotFoundException('Recurring payment not found');
            }

            await recurringPayment.update(
                {
                    ...(dto.name !== undefined && { name: dto.name }),
                    ...(dto.type !== undefined && { type: dto.type }),
                    ...(dto.description !== undefined && {
                        description: dto.description,
                    }),
                    ...(dto.amount !== undefined && { amount: dto.amount }),
                    ...(dto.currency !== undefined && {
                        currency: dto.currency,
                    }),
                    ...(dto.billing_cycle !== undefined && {
                        billing_cycle: dto.billing_cycle,
                    }),
                    ...(dto.due_date !== undefined && {
                        due_date: new Date(dto.due_date),
                    }),
                    ...(dto.is_auto_renew !== undefined && {
                        is_auto_renew: dto.is_auto_renew,
                    }),
                    ...(dto.is_archived !== undefined && {
                        is_archived: dto.is_archived,
                    }),
                    ...(dto.is_free_trial !== undefined && {
                        is_free_trial: dto.is_free_trial,
                    }),
                    ...(dto.icon !== undefined && { icon: dto.icon }),
                },
                { transaction },
            );

            await transaction.commit();

            this.logger.log(
                `Successfully updated recurring payment ${id} for user: ${currentUserEmail}`,
            );

            return { message: 'Successfully updated recurring payment' };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error updating recurring payment ${id} for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    async remove(id: string, currentUserId: string, currentUserEmail: string) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Deleting recurring payment ${id} for user: ${currentUserEmail}`,
            );

            const recurringPayment = await this.recurringPaymentModel.findOne({
                where: { id, user_id: currentUserId },
                transaction,
            });

            if (!recurringPayment) {
                this.logger.warn(
                    `Recurring payment ${id} not found for user: ${currentUserEmail}`,
                );
                throw new NotFoundException('Recurring payment not found');
            }

            await recurringPayment.destroy({ transaction });

            await transaction.commit();

            this.logger.log(
                `Successfully deleted recurring payment ${id} for user: ${currentUserEmail}`,
            );

            return { message: 'Successfully deleted recurring payment' };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error deleting recurring payment ${id} for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    async findByIdAndOwnerId(
        id: string,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const recurringPayment = await this.recurringPaymentModel.findOne({
            where: { id: id, user_id: currentUserId },
        });

        if (!recurringPayment) {
            this.logger.warn(
                `Recurring payment ${id} not found for user: ${currentUserEmail}`,
            );
            throw new NotFoundException('Recurring payment not found');
        }

        return recurringPayment;
    }

    async advanceDueDates() {
        this.logger.log(
            'Advancing due dates for elapsed recurring payments...',
        );

        const now = toZonedTime(new Date(), RECURRING_PAYMENT_TIMEZONE);
        const todayDateOnly = format(now, 'yyyy-MM-dd');

        const elapsedPayments = await this.recurringPaymentModel.findAll({
            where: { is_archived: false, due_date: { [Op.lt]: new Date() } },
        });

        let processedCount = 0;

        for (const payment of elapsedPayments) {
            const dueDateInTz = toZonedTime(
                payment.due_date,
                RECURRING_PAYMENT_TIMEZONE,
            );

            // Due date's calendar day may still be today (reminders may
            // still be firing for it) - only roll forward past due dates.
            if (format(dueDateInTz, 'yyyy-MM-dd') >= todayDateOnly) {
                continue;
            }

            const transaction = await this.sequelize.transaction();
            try {
                if (!payment.is_auto_renew) {
                    await payment.update(
                        { is_archived: true },
                        { transaction },
                    );
                    await transaction.commit();
                    processedCount++;
                    continue;
                }

                if (payment.is_free_trial && payment.is_auto_renew) {
                    await payment.update(
                        { is_free_trial: false },
                        { transaction },
                    );
                }

                let nextDueDateInTz = dueDateInTz;
                do {
                    nextDueDateInTz = this.getNextDueDate(
                        nextDueDateInTz,
                        payment.billing_cycle,
                    );
                } while (format(nextDueDateInTz, 'yyyy-MM-dd') < todayDateOnly);

                const nextDueDate = fromZonedTime(
                    nextDueDateInTz,
                    RECURRING_PAYMENT_TIMEZONE,
                );

                await payment.update(
                    { due_date: nextDueDate },
                    { transaction },
                );
                await transaction.commit();
                processedCount++;
            } catch (error) {
                await transaction.rollback();

                this.logger.error(
                    `Error advancing due date for recurring payment: ${payment.id}`,
                    error,
                );
            }
        }

        this.logger.log(
            `Completed advancing due dates for elapsed ${processedCount} recurring payment(s)`,
        );
    }

    private getNextDueDate(
        dueDate: Date,
        billingCycle: RecurringPaymentBillingCycle,
    ): Date {
        switch (billingCycle) {
            case RecurringPaymentBillingCycle.Weekly:
                return addWeeks(dueDate, 1);
            case RecurringPaymentBillingCycle.Monthly:
                return addMonths(dueDate, 1);
            case RecurringPaymentBillingCycle.Quarterly:
                return addQuarters(dueDate, 1);
            case RecurringPaymentBillingCycle.Yearly:
                return addYears(dueDate, 1);
        }
    }
}
