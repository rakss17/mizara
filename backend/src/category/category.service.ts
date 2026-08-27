import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, UniqueConstraintError } from 'sequelize';

import { CategoryModel } from '@/category/models/category.model';
import { RecurringPaymentModel } from '@/recurring-payment/models/recurring-payment.model';
import { CreateCategoryDto } from '@/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/category/dto/update-category.dto';

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name);

    constructor(
        @InjectModel(CategoryModel)
        private categoryModel: typeof CategoryModel,
        @InjectModel(RecurringPaymentModel)
        private recurringPaymentModel: typeof RecurringPaymentModel,
        @InjectConnection()
        private readonly sequelize: Sequelize,
    ) {}

    async create(
        dto: CreateCategoryDto,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(`Creating category for user: ${currentUserEmail}`);

            const createdCategory = await this.categoryModel.create(
                {
                    user_id: currentUserId,
                    name: dto.name,
                    icon: dto.icon,
                },
                { transaction },
            );

            await transaction.commit();

            this.logger.log(
                `Successfully created category for user: ${currentUserEmail}`,
            );

            return {
                message: 'Successfully created category',
                data: { id: createdCategory.id },
            };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof UniqueConstraintError) {
                throw new ConflictException(
                    'A category with this name already exists',
                );
            }

            this.logger.error(
                `Error creating category for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    async findAll(currentUserId: string, currentUserEmail: string) {
        this.logger.log(`Fetching categories for user: ${currentUserEmail}`);

        const categories = await this.categoryModel.findAll({
            where: {
                [Op.or]: [{ user_id: currentUserId }, { user_id: null }],
            },
            order: [['name', 'ASC']],
        });

        return {
            message: 'Fetched categories successfully',
            data: categories,
        };
    }

    async update(
        id: string,
        dto: UpdateCategoryDto,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Updating category ${id} for user: ${currentUserEmail}`,
            );

            const category = await this.categoryModel.findOne({
                where: { id, user_id: currentUserId },
                transaction,
            });

            if (!category) {
                this.logger.warn(
                    `Category ${id} not found for user: ${currentUserEmail}`,
                );
                throw new NotFoundException('Category not found');
            }

            await category.update(
                {
                    ...(dto.name !== undefined && { name: dto.name }),
                    ...(dto.icon !== undefined && { icon: dto.icon }),
                },
                { transaction },
            );

            await transaction.commit();

            this.logger.log(
                `Successfully updated category ${id} for user: ${currentUserEmail}`,
            );

            return { message: 'Successfully updated category' };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            if (error instanceof UniqueConstraintError) {
                throw new ConflictException(
                    'A category with this name already exists',
                );
            }

            this.logger.error(
                `Error updating category ${id} for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    async remove(id: string, currentUserId: string, currentUserEmail: string) {
        const transaction = await this.sequelize.transaction();
        try {
            this.logger.log(
                `Deleting category ${id} for user: ${currentUserEmail}`,
            );

            const category = await this.categoryModel.findOne({
                where: { id, user_id: currentUserId },
                transaction,
            });

            if (!category) {
                this.logger.warn(
                    `Category ${id} not found for user: ${currentUserEmail}`,
                );
                throw new NotFoundException('Category not found');
            }

            // Paranoid delete only hides the row - clear references so
            // recurring payments don't keep pointing at a hidden category.
            await this.recurringPaymentModel.update(
                { category_id: null },
                { where: { category_id: id }, transaction },
            );

            await category.destroy({ transaction });

            await transaction.commit();

            this.logger.log(
                `Successfully deleted category ${id} for user: ${currentUserEmail}`,
            );

            return { message: 'Successfully deleted category' };
        } catch (error) {
            await transaction.rollback();

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error deleting category ${id} for user: ${currentUserEmail}`,
                error,
            );

            throw error;
        }
    }

    async findAccessibleOrFail(
        id: string,
        currentUserId: string,
        currentUserEmail: string,
    ) {
        const category = await this.categoryModel.findOne({
            where: {
                id,
                [Op.or]: [{ user_id: currentUserId }, { user_id: null }],
            },
        });

        if (!category) {
            this.logger.warn(
                `Category ${id} not found for user: ${currentUserEmail}`,
            );
            throw new NotFoundException('Category not found');
        }

        return category;
    }
}
