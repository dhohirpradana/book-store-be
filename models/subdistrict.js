"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubDistrict extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SubDistrict.belongsTo(models.City, {
        as: "city",
        foreignKey: {
          name: "cityId",
        },
      });
    }
  }
  SubDistrict.init(
    {
      cityId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SubDistrict",
    }
  );
  return SubDistrict;
};
