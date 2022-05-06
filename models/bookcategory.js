"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookCategory.belongsTo(models.Book, {
        as: "book",
        foreignKey: {
          name: "bookId",
        },
      });

      BookCategory.belongsTo(models.Category, {
        as: "category",
        foreignKey: {
          name: "categoryId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        hooks: true,
      });
    }
  }
  BookCategory.init(
    {
      bookId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BookCategory",
    }
  );
  return BookCategory;
};
