'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transactionAmount: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      transactionDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      restaurantId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Restaurants',
          key: 'id',
          as: 'restaurantId'
        }
      },
      dishId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Menus',
          key: 'id',
          as: 'dishId'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  }
};