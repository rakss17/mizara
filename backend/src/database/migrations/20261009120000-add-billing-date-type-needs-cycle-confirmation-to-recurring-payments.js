'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.addColumn(
                'recurring_payments',
                'billing_date_type',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: 'Fixed',
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'recurring_payments',
                'needs_cycle_confirmation',
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeColumn(
                'recurring_payments',
                'needs_cycle_confirmation',
                { transaction },
            );
            await queryInterface.removeColumn(
                'recurring_payments',
                'billing_date_type',
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
