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
      User.hasMany(models.Product, {
        as: "products",
        foreignKey: {
          name: "idUser",
        },
      });

      User.hasMany(models.Profile, {
        as: "profiles",
        foreignKey: {
          name: "idUser",
        },
      });

      User.belongsTo(models.Role, {
        as: "role",
        foreignKey: { name: "idRole" },
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      idRole: { type: DataTypes.INTEGER, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  // user.init({})
  return User;
};
