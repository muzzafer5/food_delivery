'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Restaurant.hasMany(models.OpenHour, {
        foreignKey: 'restaurantId',
        as: 'openhours'
      })
      Restaurant.hasMany(models.Menu, {
        foreignKey: 'restaurantId',
        as: 'menus'
      })
    }
  };
  Restaurant.init({
    restaurantName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cashBalance: {
      type: DataTypes.FLOAT
    }
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};