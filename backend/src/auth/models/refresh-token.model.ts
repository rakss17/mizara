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

interface RefreshToken {
    id?: string;
    user_id: string;
    token_hash: string;
    family_id: string;
    expires_at: Date;
    revoked_at?: Date | null;
    replaced_by_id?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}

@Table({
    tableName: 'refresh_tokens',
    underscored: true,
    timestamps: true,
})
export class RefreshTokenModel extends Model<RefreshToken> {
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
        unique: true,
    })
    declare token_hash: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare family_id: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare expires_at: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare revoked_at: Date | null;

    @ForeignKey(() => RefreshTokenModel)
    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    declare replaced_by_id: string | null;

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
