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

interface ReminderSettings {
    id?: string;
    recurring_payment_id?: string;
    is_enabled: boolean;
    remind_before_days: ReminderOffsetDays[];
    channels: ReminderChannel[];
    created_at?: Date | null;
    updated_at?: Date | null;
}

@Table({
    tableName: 'reminder_settings',
    underscored: true,
    timestamps: true,
})
export class ReminderSettingsModel extends Model<ReminderSettings> {
    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => RecurringPaymentModel)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        unique: true,
    })
    declare recurring_payment_id: string;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare is_enabled: boolean;

    @Default([ReminderOffsetDays.ThreeDaysBefore])
    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: false,
    })
    declare remind_before_days: ReminderOffsetDays[];

    @Default([ReminderChannel.Email])
    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false,
    })
    declare channels: ReminderChannel[];

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
