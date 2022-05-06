"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        as: "seller",
        foreignKey: {
          name: "sellerId",
        },
      });

      Transaction.belongsTo(models.User, {
        as: "buyer",
        foreignKey: {
          name: "buyerId",
        },
      });

      Transaction.belongsTo(models.Book, {
        as: "book",
        foreignKey: {
          name: "bookId",
        },
      });
    }
  }
  Transaction.init(
    {
      bookId: DataTypes.INTEGER,
      transactionId: DataTypes.INTEGER,
      sellerId: DataTypes.INTEGER,
      buyerId: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      count: DataTypes.INTEGER,
      discount: DataTypes.INTEGER,
      origin: DataTypes.INTEGER,
      destination: DataTypes.INTEGER,
      courier: DataTypes.STRING,
      courierCost: DataTypes.INTEGER,
      subTotal: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
