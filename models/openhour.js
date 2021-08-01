'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OpenHour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OpenHour.belongsTo(models.Restaurant, {
        foreignKey: 'restaurantId',
        onDelete: 'CASCADE'
      })
    }
  };
  OpenHour.init({
    day: {
      type : DataTypes.STRING,
      allowNull : false
    },
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OpenHour',
  });
  return OpenHour;
};