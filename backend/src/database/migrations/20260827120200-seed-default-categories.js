'use strict';

const { randomUUID } = require('crypto');

const DEFAULT_CATEGORIES = [
    { name: 'Streaming', icon: 'streaming' },
    { name: 'Utilities', icon: 'utilities' },
    { name: 'Insurance', icon: 'insurance' },
    { name: 'Housing & Rent', icon: 'housing' },
    { name: 'Food & Dining', icon: 'food' },
    { name: 'Transportation', icon: 'transportation' },
    { name: 'Health & Fitness', icon: 'health-fitness' },
    { name: 'Software & Subscriptions', icon: 'software' },
    { name: 'Entertainment', icon: 'entertainment' },
    { name: 'Other', icon: 'other' },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const now = new Date();

        await queryInterface.bulkInsert(
            'categories',
            DEFAULT_CATEGORIES.map((category) => ({
                id: randomUUID(),
                user_id: null,
                name: category.name,
                icon: category.icon,
                created_at: now,
                updated_at: now,
            })),
        );
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('categories', { user_id: null });
    },
};
