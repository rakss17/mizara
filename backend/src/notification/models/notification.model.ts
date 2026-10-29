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

import { UserModel } from '@/user/models/user.model';
import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { NotificationType } from '@/common/enum';

interface Notification {
    id?: string;
    user_id: string;
    recurring_payment_id?: string | null;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, unknown> | null;
    read_at?: Date | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}

@Table({
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
})
export class NotificationModel extends Model<Notification> {
    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare user_id: string;

    @ForeignKey(() => RecurringPaymentModel)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    declare recurring_payment_id: string | null;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare type: NotificationType;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare body: string;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    declare data: Record<string, unknown> | null;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare read_at: Date | null;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;

    @BelongsTo(() => UserModel, {
        foreignKey: 'user_id',
        as: 'user',
    })
    declare user: UserModel;

    @BelongsTo(() => RecurringPaymentModel, {
        foreignKey: 'recurring_payment_id',
        as: 'recurring_payment',
    })
    declare recurring_payment: RecurringPaymentModel | null;
}
