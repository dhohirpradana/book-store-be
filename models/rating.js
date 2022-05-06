"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rating.belongsTo(models.Book, {
        as: "book",
        foreignKey: {
          name: "bookId",
        },
      });
      Rating.belongsTo(models.User, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  Rating.init(
    {
      bookId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      star: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );
  return Rating;
};
