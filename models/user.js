'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders'
      })
      User.belongsTo(models.Auth,{
        foreignKey : 'authId',
        onDelete: 'CASCADE'
      })
    }
  };
  User.init({
    name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    cashBalance: {
      defaultValue: 0,
      type : DataTypes.FLOAT
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};