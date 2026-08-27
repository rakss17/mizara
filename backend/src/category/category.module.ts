import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryModel } from './models/category.model';
import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';

@Module({
    imports: [
        SequelizeModule.forFeature([CategoryModel, RecurringPaymentModel]),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService],
})
export class CategoryModule {}
