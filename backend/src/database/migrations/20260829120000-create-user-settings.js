'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_settings', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },

            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            currency: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'PHP',
            },

            timezone: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'Asia/Manila',
            },

            theme: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'light',
            },

            push_notifications_enabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            email_notifications_enabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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
    },

    async down(queryInterface) {
        await queryInterface.dropTable('user_settings');
    },
};
