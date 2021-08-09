'use strict';

/**
 * @swagger
 * definitions:
 *  Order:
 *    type : object
 *    properties:
 *      id:
 *        type : integer
 *      transactionAmount:
 *        type : float
 *      transactionDate:
 *        type : date
 *      userId:
 *        type : integer
 *      restaurantId:
 *        type : integer
 *      dishId:
 *        type : integer
*/

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userID',
        onDelete: 'CASCADE'
      })
      Order.belongsTo(models.Restaurant, {
        foreignKey: 'restaurantID',
        onDelete: 'CASCADE'
      })
      Order.belongsTo(models.Menu, {
        foreignKey: 'dishId',
        onDelete: 'CASCADE'
      })
    }
  };
  Order.init({
    transactionAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    transactionDate: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Date.now()
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};