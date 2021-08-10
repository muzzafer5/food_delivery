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
 *        type : number
 *        format: float
 *      transactionDate:
 *        type : string
 *        format : date
 *      userId:
 *        type : integer
 *      restaurantId:
 *        type : integer
 *      dishId:
 *        type : integer
*/

const Sequelize = require('sequelize');
const Model = Sequelize.Model
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
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};