'use strict';

/**
 * @swagger
 * definitions:
 *  Menu:
 *    type : object
 *    properties:
 *      id:
 *        type : integer
 *      dishName:
 *        type : string
 *      price:
 *        type : number
 *        format: float
 *      restaurantId:
 *        type : integer
*/

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Menu.belongsTo(models.Restaurant, {
        foreignKey: 'restaurantId',
        onDelete: 'CASCADE'
      })
    }
  };
  Menu.init({
    dishName: {
      type : DataTypes.STRING,
      allowNull : false,
    },
    price: {
      type : DataTypes.FLOAT,
    }
  }, {
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};