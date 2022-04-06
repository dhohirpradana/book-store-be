"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // address.belongsTo(models.profile, {
      //   as: "profile",
      //   foreignKey: {
      //     name: "idProfile",
      //   },
      // });
    }
  }
  Address.init(
    {
      address: DataTypes.STRING,
      idProfile: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
