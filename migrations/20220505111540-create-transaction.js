"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bookId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Books",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      transactionId: {
        type: Sequelize.INTEGER,
      },
      sellerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      buyerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      price: {
        type: Sequelize.INTEGER,
      },
      count: {
        type: Sequelize.INTEGER,
      },
      discount: {
        type: Sequelize.INTEGER,
      },
      origin: {
        type: Sequelize.INTEGER,
      },
      destination: {
        type: Sequelize.INTEGER,
      },
      courier: {
        type: Sequelize.STRING,
      },
      courierCost: {
        type: Sequelize.INTEGER,
      },
      subTotal: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};
