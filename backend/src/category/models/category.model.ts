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
    HasMany,
    UpdatedAt,
    CreatedAt,
    DeletedAt,
} from 'sequelize-typescript';

import { UserModel } from '@/user/models/user.model';
import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';

interface Category {
    id?: string;
    user_id?: string | null;
    name: string;
    icon?: string;
    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}

@Table({
    tableName: 'categories',
    underscored: true,
    timestamps: true,
    paranoid: true,
})
export class CategoryModel extends Model<Category> {
    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    declare user_id: string | null;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare icon: string | null;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;

    @DeletedAt
    declare deleted_at: Date;

    @BelongsTo(() => UserModel, {
        foreignKey: 'user_id',
        as: 'user',
    })
    declare user: UserModel | null;

    @HasMany(() => RecurringPaymentModel, {
        foreignKey: 'category_id',
        as: 'recurring_payments',
    })
    declare recurring_payments: RecurringPaymentModel[];
}
