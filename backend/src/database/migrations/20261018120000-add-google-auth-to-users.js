'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            // Google-only users sign in without a password.
            await queryInterface.changeColumn(
                'users',
                'password',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'users',
                'google_id',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                    unique: true,
                },
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.removeColumn('users', 'google_id', {
                transaction,
            });

            // Google-only users have no password and cannot satisfy NOT NULL.
            await queryInterface.bulkDelete(
                'users',
                { password: null },
                { transaction },
            );

            await queryInterface.changeColumn(
                'users',
                'password',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                { transaction },
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
