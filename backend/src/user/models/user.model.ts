import {
    Table,
    Model,
    IsUUID,
    PrimaryKey,
    Default,
    DataType,
    Column,
    UpdatedAt,
    CreatedAt,
    DeletedAt,
    HasMany,
} from 'sequelize-typescript';

import { VerificationCodeModel } from '@/auth/models/verification-code.model';
import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';

interface User {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_email_verified?: boolean;
    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
}

@Table({
    tableName: 'users',
    underscored: true,
    timestamps: true,
    paranoid: true,
})
export class UserModel extends Model<User> {
    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare first_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare last_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare is_email_verified: boolean;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;

    @DeletedAt
    declare deleted_at: Date;

    @HasMany(() => VerificationCodeModel, {
        foreignKey: 'user_id',
        as: 'verification_codes',
    })
    declare verification_codes: VerificationCodeModel[];

    @HasMany(() => RecurringPaymentModel, {
        foreignKey: 'user_id',
        as: 'recurring_payments',
    })
    declare recurring_payments: RecurringPaymentModel[];
}
