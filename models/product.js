"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // product.belongsToMany(models.category, {
      //   as: "categories",
      //   through: {
      //     model: "productCategory",
      //     as: "bridge",
      //   },
      //   foreignKey: "idProduct",
      // });
    }
  }
  product.init(
    {
      name: DataTypes.STRING,
      desc: DataTypes.TEXT,
      price: DataTypes.BIGINT,
      image: DataTypes.STRING,
      qty: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
