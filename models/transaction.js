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
      Transaction.belongsTo(models.User, {
        as: "seller",
        foreignKey: {
          name: "idSeller",
        },
      });

      Transaction.belongsTo(models.User, {
        as: "buyer",
        foreignKey: {
          name: "idBuyer",
        },
      });

      Transaction.belongsTo(models.Product, {
        as: "product",
        foreignKey: {
          name: "idProduct",
        },
      });

      Transaction.belongsTo(models.TransactionStatus, {
        as: "status",
        foreignKey: { name: "idStatus" },
      });
    }
  }
  Transaction.init(
    {
      idProduct: DataTypes.INTEGER,
      idBuyer: DataTypes.INTEGER,
      idSeller: DataTypes.INTEGER,
      price: DataTypes.BIGINT,
      idStatus: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
