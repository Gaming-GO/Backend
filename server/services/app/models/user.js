'use strict';
const { hashPassword } = require('../helpers/bcrypt');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Device);
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
      nik: DataTypes.STRING,
      ktpImg: DataTypes.STRING,
      selfieImg: DataTypes.STRING,
      role: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      address: DataTypes.TEXT,
      approved: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.beforeCreate((instance) => {
    instance.password = hashPassword(instance.password);
  });

  return User;
};
