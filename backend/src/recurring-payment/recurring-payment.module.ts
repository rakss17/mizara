import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RecurringPaymentService } from './recurring-payment.service';
import { RecurringPaymentController } from './recurring-payment.controller';
import { RecurringPaymentModel } from './models/recurring-payment.model';
import { RecurringPaymentSchedulerService } from './recurring-payment-scheduler.service';

@Module({
    imports: [SequelizeModule.forFeature([RecurringPaymentModel])],
    controllers: [RecurringPaymentController],
    providers: [RecurringPaymentService, RecurringPaymentSchedulerService],
    exports: [RecurringPaymentService],
})
export class RecurringPaymentModule {}
