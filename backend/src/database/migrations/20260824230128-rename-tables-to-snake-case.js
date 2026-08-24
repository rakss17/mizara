'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameTable('Users', 'users');
        await queryInterface.renameTable('Verification_Codes', 'verification_codes');
        await queryInterface.renameTable('Recurring_Payments', 'recurring_payments');
        await queryInterface.renameTable('Reminder_Settings', 'reminder_settings');
        await queryInterface.renameTable('Sent_Reminders', 'sent_reminders');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.renameTable('users', 'Users');
        await queryInterface.renameTable('verification_codes', 'Verification_Codes');
        await queryInterface.renameTable('recurring_payments', 'Recurring_Payments');
        await queryInterface.renameTable('reminder_settings', 'Reminder_Settings');
        await queryInterface.renameTable('sent_reminders', 'Sent_Reminders');
    },
};
