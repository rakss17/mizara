'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('categories', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },

            user_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            icon: {
                type: Sequelize.STRING,
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

            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        // Only user-created categories need a duplicate-name guard; system
        // defaults (user_id IS NULL) are controlled by our own seed data.
        await queryInterface.sequelize.query(`
            CREATE UNIQUE INDEX categories_user_id_lower_name_unique
            ON categories (user_id, lower(name))
            WHERE deleted_at IS NULL AND user_id IS NOT NULL
        `);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(
            'DROP INDEX IF EXISTS categories_user_id_lower_name_unique',
        );
        await queryInterface.dropTable('categories');
    },
};
