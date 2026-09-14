'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('refresh_tokens', {
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

            token_hash: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            family_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },

            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            revoked_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            replaced_by_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'refresh_tokens',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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

        await queryInterface.addIndex('refresh_tokens', ['user_id']);
        await queryInterface.addIndex('refresh_tokens', ['family_id']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('refresh_tokens');
    },
};
