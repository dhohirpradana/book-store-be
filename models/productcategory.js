"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductCategory.belongsTo(models.Product, {
        as: "product",
        foreignKey: {
          name: "idProduct",
        },
      });

      ProductCategory.belongsTo(models.Category, {
        as: "category",
        foreignKey: {
          name: "idCategory",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        hooks: true,
      });
    }
  }
  ProductCategory.init(
    {
      idProduct: DataTypes.INTEGER,
      idCategory: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ProductCategory",
    }
  );
  return ProductCategory;
};
