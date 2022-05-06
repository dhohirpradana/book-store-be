const { Transaction, User, Book } = require("../../models");

const transactionDao = {
  create,
  findAll,
  findById,
  findByBuyer,
  findBySeller,
  update,
};

async function findAll() {
  return await Transaction.findAll({
    attributes: {
      exclude: ["bookId", "sellerId", "buyerId", "idStatus"],
    },
    include: [
      {
        model: Book,
        as: "book",
        attributes: { exclude: ["price", "userId", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "seller",
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "buyer",
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
    ],
  });
}

async function findById(id) {
  return await Transaction.findByPk(id, {
    include: [
      {
        model: Book,
        as: "book",
        attributes: { exclude: ["price", "userId", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "seller",
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "buyer",
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
    ],
  });
}

async function findBySeller(sellerId) {
  return await Transaction.findAll({
    where: { sellerId: sellerId },
    include: [
      {
        model: Book,
        as: "book",
        attributes: { exclude: ["price", "userId", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "seller",
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "buyer",
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
      {
        model: TransactionStatus,
        as: "status",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });
}

async function findByBuyer(buyerId) {
  return await Transaction.findAll({
    where: { buyerId: buyerId },
    include: [
      {
        model: Book,
        as: "book",
        attributes: { exclude: ["price", "userId", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "seller",
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "buyer",
        attributes: {
          exclude: ["password", "role", "createdAt", "updatedAt"],
        },
      },
      {
        model: TransactionStatus,
        as: "status",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });
}

async function create(transaction) {
  var newtransaction = new Transaction(transaction);
  return await newtransaction.save();
}

async function update(transaction, id) {
  return await Transaction.update(transaction, { where: { id } });
}

module.exports = transactionDao;
