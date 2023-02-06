'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Device.belongsTo(models.User);
      Device.belongsTo(models.Category);
      Device.hasMany(models.Detail);
    }
  }
  Device.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      imgUrl: DataTypes.STRING,
      price: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      specs: DataTypes.STRING,
      // location: DataTypes.GEOMETRY('POINT'),
    },
    {
      sequelize,
      modelName: 'Device',
    }
  );
  return Device;
};
