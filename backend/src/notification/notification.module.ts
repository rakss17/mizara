import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationModel } from './models/notification.model';

@Module({
    imports: [SequelizeModule.forFeature([NotificationModel])],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}
