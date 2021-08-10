'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('OpenHours', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        day: {
          allowNull : false,
          type: Sequelize.STRING
        },
        from: {
          type: Sequelize.INTEGER
        },
        to: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        restaurantId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Restaurants',
            key: 'id',
            as: 'restaurantId'
          }
        }
      }, {transaction});

      await queryInterface.addIndex('OpenHours', ['day'], { transaction });
      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OpenHours');
  }
};