'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Sent_Reminders', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },

            recurring_payment_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Recurring_Payments',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            offset_days: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            channel: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            reminder_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },

            sent_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.addIndex('Sent_Reminders', {
            fields: ['recurring_payment_id', 'offset_days', 'channel', 'reminder_date'],
            unique: true,
            name: 'sent_reminders_dedup_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Sent_Reminders');
    },
};
