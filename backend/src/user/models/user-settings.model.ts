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
import { Theme } from '@/common/enum';

interface UserSettings {
    id?: string;
    user_id: string;
    currency?: string;
    timezone?: string;
    theme?: Theme;
    push_notifications_enabled?: boolean;
    email_notifications_enabled?: boolean;
    created_at?: Date | null;
    updated_at?: Date | null;
}

@Table({
    tableName: 'user_settings',
    underscored: true,
    timestamps: true,
})
export class UserSettingsModel extends Model<UserSettings> {
    @IsUUID(4)
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @ForeignKey(() => UserModel)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        unique: true,
    })
    declare user_id: string;

    @Default('PHP')
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare currency: string;

    @Default('Asia/Manila')
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare timezone: string;

    @Default(Theme.Light)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare theme: Theme;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare push_notifications_enabled: boolean;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare email_notifications_enabled: boolean;

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
