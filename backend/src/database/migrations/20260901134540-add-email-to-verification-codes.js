'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('verification_codes', 'email', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('verification_codes', 'email');
    },
};
