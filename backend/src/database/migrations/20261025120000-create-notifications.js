'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notifications', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },

            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            recurring_payment_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'recurring_payments',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },

            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            body: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            data: {
                type: Sequelize.JSONB,
                allowNull: true,
            },

            read_at: {
                type: Sequelize.DATE,
                allowNull: true,
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

        // Feed query: a user's notifications, newest first.
        await queryInterface.addIndex('notifications', {
            fields: ['user_id', { name: 'created_at', order: 'DESC' }],
            name: 'notifications_user_id_created_at',
        });

        await queryInterface.addIndex('notifications', [
            'recurring_payment_id',
        ]);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('notifications');
    },
};
