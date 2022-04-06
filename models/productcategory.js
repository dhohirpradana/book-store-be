"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class productCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      productCategory.belongsTo(models.product, {
        as: "product",
        foreignKey: {
          name: "idProduct",
        },
      });

      productCategory.belongsTo(models.category, {
        as: "category",
        foreignKey: {
          name: "idCategory",
        },
      });
    }
  }
  productCategory.init(
    {
      idProduct: DataTypes.INTEGER,
      idCategory: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "productCategory",
    }
  );
  return productCategory;
};
