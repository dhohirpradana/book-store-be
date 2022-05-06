"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      City.belongsTo(models.Province, {
        as: "province",
        foreignKey: {
          name: "provinceId",
        },
      });
    }
  }
  City.init(
    {
      name: DataTypes.STRING,
      provinceId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "City",
    }
  );
  return City;
};
