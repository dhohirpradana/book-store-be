"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsToMany(models.Category, {
        as: "categories",
        through: {
          model: "BookCategory",
          as: "bridge",
        },
        foreignKey: "bookId",
      });
    }
  }
  Book.init(
    {
      title: DataTypes.STRING,
      desc: DataTypes.STRING,
      author: DataTypes.STRING,
      isbn: DataTypes.STRING,
      publicationDate: DataTypes.STRING,
      price: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      isEbook: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
      document: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
