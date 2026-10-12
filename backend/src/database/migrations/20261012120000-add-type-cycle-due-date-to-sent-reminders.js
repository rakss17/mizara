'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.addColumn(
                'sent_reminders',
                'type',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: 'due',
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'sent_reminders',
                'cycle_due_date',
                {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                { transaction },
            );

            // Only due reminders have an offset from the due date.
            await queryInterface.changeColumn(
                'sent_reminders',
                'offset_days',
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction },
            );

            // One overdue / cycle confirmation notice per channel per cycle.
            // Due reminders leave cycle_due_date null, so they never collide.
            // transaction goes in the options object - with this form of
            // addIndex, a third argument is read as the raw table name.
            await queryInterface.addIndex('sent_reminders', {
                fields: [
                    'recurring_payment_id',
                    'type',
                    'channel',
                    'cycle_due_date',
                ],
                unique: true,
                name: 'sent_reminders_cycle_dedup_unique',
                transaction,
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeIndex(
                'sent_reminders',
                'sent_reminders_cycle_dedup_unique',
                { transaction },
            );

            await queryInterface.bulkDelete(
                'sent_reminders',
                { offset_days: null },
                { transaction },
            );

            await queryInterface.changeColumn(
                'sent_reminders',
                'offset_days',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                { transaction },
            );

            await queryInterface.removeColumn(
                'sent_reminders',
                'cycle_due_date',
                { transaction },
            );
            await queryInterface.removeColumn('sent_reminders', 'type', {
                transaction,
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
