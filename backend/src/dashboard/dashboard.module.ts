import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';

@Module({
    imports: [SequelizeModule.forFeature([RecurringPaymentModel])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
