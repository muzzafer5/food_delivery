'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        cashBalance: {
          allowNull: false,
          type: Sequelize.FLOAT
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        authId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Auths',
            key: 'id',
            as: 'authId'
          }
        }
      }, { transaction });

      await queryInterface.addIndex('Users', ['authId'], { transaction });
      await transaction.commit();
      
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};