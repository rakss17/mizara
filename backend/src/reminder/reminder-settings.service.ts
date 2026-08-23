import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

import { ReminderSettingsModel } from '@/reminder/models/reminder-settings.model';
import { UpsertReminderSettingsDto } from '@/reminder/dto/upsert-reminder-settings.dto';
import { RecurringPaymentService } from '@/recurring-payment/recurring-payment.service';

@Injectable()
export class ReminderSettingsService {
    private readonly logger = new Logger(ReminderSettingsService.name);

    constructor(
        private readonly recurringPaymentService: RecurringPaymentService,
        @InjectModel(ReminderSettingsModel)
        private reminderSettingsModel: typeof ReminderSettingsModel,
        @InjectConnection()
        private readonly sequelize: Sequelize,
    ) {}

    async findOne(
        recurringPaymentId: string,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        this.logger.log(
            `Fetching reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
        );

        await this.recurringPaymentService.findByIdAndOwnerId(
            recurringPaymentId,
            currentUserId,
            currentUserEmail,
        );

        const reminderSettings = await this.reminderSettingsModel.findOne({
            where: { recurring_payment_id: recurringPaymentId },
        });

        if (!reminderSettings) {
            this.logger.warn(
                `Reminder settings not found for recurring payment: ${recurringPaymentId}, user: ${currentUserEmail}`,
            );
            throw new NotFoundException('Reminder settings not found');
        }

        this.logger.log(
            `Successfully fetched reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
        );

        return {
            message: 'Fetched reminder settings successfully',
            data: reminderSettings,
        };
    }

    async upsert(
        recurringPaymentId: string,
        dto: UpsertReminderSettingsDto,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Upserting reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
            );

            await this.recurringPaymentService.findByIdAndOwnerId(
                recurringPaymentId,
                currentUserId,
                currentUserEmail,
            );

            await this.reminderSettingsModel.upsert(
                {
                    recurring_payment_id: recurringPaymentId,
                    is_enabled: dto.is_enabled,
                    remind_before_days: dto.remind_before_days,
                    channels: dto.channels,
                },
                { transaction },
            );

            await transaction.commit();

            this.logger.log(
                `Successfully upserted reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
            );

            return {
                message: 'Successfully saved reminder settings',
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error upserting reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    async remove(
        recurringPaymentId: string,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Deleting reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
            );

            await this.recurringPaymentService.findByIdAndOwnerId(
                recurringPaymentId,
                currentUserId,
                currentUserEmail,
            );

            const reminderSettings = await this.reminderSettingsModel.findOne({
                where: { recurring_payment_id: recurringPaymentId },
            });

            if (!reminderSettings) {
                this.logger.warn(
                    `Reminder settings for recurring payment ${recurringPaymentId} not found for user: ${currentUserEmail}`,
                );
                throw new NotFoundException('Reminder settings not found');
            }

            await reminderSettings.destroy({ transaction });

            await transaction.commit();

            this.logger.log(
                `Successfully deleted reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
            );

            return { message: 'Successfully deleted reminder settings' };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error deleting reminder settings for recurring payment ${recurringPaymentId}, user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }
}
