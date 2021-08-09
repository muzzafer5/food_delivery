'use strict';

/**
 * @swagger
 * definitions:
 *  Auth:
 *    type : object
 *    properties:
 *      username:
 *        type : string
 *      password:
 *        type : string
*/

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Auth.hasOne(models.User, {
        foreignKey: 'authId'
      })
    }
  };
  Auth.init({
    username: {
      type : DataTypes.STRING,
      allowNull : false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Auth',
  });
  return Auth;
};