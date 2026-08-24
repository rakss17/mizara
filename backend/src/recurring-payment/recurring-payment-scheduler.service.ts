import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RecurringPaymentService } from './recurring-payment.service';

@Injectable()
export class RecurringPaymentSchedulerService {
    private readonly logger = new Logger(RecurringPaymentSchedulerService.name);

    constructor(
        private readonly recurringPaymentService: RecurringPaymentService,
    ) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleBillingCycleRollover() {
        this.logger.log(
            'Running cron job for recurring payment billing cycle rollover...',
        );

        await this.recurringPaymentService.advanceDueDates();

        this.logger.log(
            'Completed cron job for recurring payment billing cycle rollover',
        );
    }
}
