const {
  Transaction,
  TransactionStatus,
  User,
  Product,
} = require("../../models");

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
      exclude: ["idProduct", "idSeller", "idBuyer", "idStatus"],
    },
    include: [
      {
        model: Product,
        as: "product",
        attributes: { exclude: ["price", "idUser", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "seller",
        attributes: {
          exclude: ["password", "idRole", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "buyer",
        attributes: {
          exclude: ["password", "idRole", "createdAt", "updatedAt"],
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

async function findById(id) {
  return await Transaction.findByPk(id, {
    include: [
      {
        model: Product,
        as: "product",
        attributes: { exclude: ["price", "idUser", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "seller",
        attributes: {
          exclude: ["password", "idRole", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "buyer",
        attributes: {
          exclude: ["password", "idRole", "createdAt", "updatedAt"],
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

async function findBySeller(idSeller) {
  return await Transaction.findAll({
    where: { idSeller: idSeller },
    include: [
      {
        model: Product,
        as: "product",
        attributes: { exclude: ["price", "idUser", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "seller",
        attributes: {
          exclude: ["password", "idRole", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "buyer",
        attributes: {
          exclude: ["password", "idRole", "createdAt", "updatedAt"],
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

async function findByBuyer(idBuyer) {
  return await Transaction.findAll({
    where: { idBuyer: idBuyer },
    include: [
      {
        model: Product,
        as: "product",
        attributes: { exclude: ["price", "idUser", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "seller",
        attributes: {
          exclude: ["password", "idRole", "createdAt", "updatedAt"],
        },
      },
      {
        model: User,
        as: "buyer",
        attributes: {
          exclude: ["password", "idRole", "createdAt", "updatedAt"],
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
