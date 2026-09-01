import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    BelongsTo,
    UpdatedAt,
    CreatedAt,
} from 'sequelize-typescript';

import { UserModel } from '@/user/models/user.model';
import { VerificationCodeType } from '@/common/enum';

interface VerificationCode {
    id?: string;
    user_id: string;
    email: string;
    code_hash: string;
    type: VerificationCodeType;
    expires_at: Date;
    attempts: number;
    used_at?: Date | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}

@Table({
    tableName: 'verification_codes',
    underscored: true,
    timestamps: true,
})
export class VerificationCodeModel extends Model<VerificationCode> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare user_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: '',
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare code_hash: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare type: VerificationCodeType;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare expires_at: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    declare attempts: number;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare used_at: Date | null;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;

    @BelongsTo(() => UserModel, {
        foreignKey: 'user_id',
        as: 'user',
    })
    declare user: UserModel;
}
