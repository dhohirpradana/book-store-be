"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Book, {
        as: "books",
        foreignKey: {
          name: "userId",
        },
      });
      User.hasOne(models.Address, {
        as: "address",
        foreignKey: {
          name: "userId",
        },
      });
      // User.belongsToMany(models.City, {
      //   as: "city",
      //   through: {
      //     model: "Address",
      //     as: "bridge",
      //   },
      //   foreignKey: "userId",
      // });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      image: DataTypes.STRING,
      gender: DataTypes.STRING,
      phone: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
