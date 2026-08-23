import {
    Table,
    Model,
    IsUUID,
    PrimaryKey,
    Default,
    DataType,
    Column,
    ForeignKey,
    BelongsTo,
    UpdatedAt,
    CreatedAt,
} from 'sequelize-typescript';

import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { ReminderChannel, ReminderOffsetDays } from '@/common/enum';

interface SentReminder {
    id?: string;
    recurring_payment_id?: string;
    offset_days: ReminderOffsetDays;
    channel: ReminderChannel;
    reminder_date: string;
    sent_at?: Date;
    created_at?: Date | null;
    updated_at?: Date | null;
}

@Table({
    tableName: 'Sent_Reminders',
    underscored: true,
    timestamps: true,
})
export class SentReminderModel extends Model<SentReminder> {
    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => RecurringPaymentModel)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare recurring_payment_id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare offset_days: ReminderOffsetDays;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare channel: ReminderChannel;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    declare reminder_date: string;

    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare sent_at: Date;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;

    @BelongsTo(() => RecurringPaymentModel, {
        foreignKey: 'recurring_payment_id',
        as: 'recurring_payment',
    })
    declare recurring_payment: RecurringPaymentModel;
}
