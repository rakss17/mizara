import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserModel } from '@/user/models/user.model';
import { UserSettingsModel } from '@/user/models/user-settings.model';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { UserSettingsController } from '@/user/user-settings.controller';
import { UserSettingsService } from '@/user/user-settings.service';

@Module({
    imports: [SequelizeModule.forFeature([UserModel, UserSettingsModel])],
    controllers: [UserController, UserSettingsController],
    providers: [UserService, UserSettingsService],
    exports: [UserService, UserSettingsService],
})
export class UserModule {}
