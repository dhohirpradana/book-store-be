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
};

async function findAll() {
  return await Transaction.findAll({
    attributes: {
      exclude: [
        "idProduct",
        "idSeller",
        "idBuyer",
        "idStatus",
        "createdAt",
        "updatedAt",
      ],
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
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
}

async function findBySeller(idSeller) {
  return await Transaction.findAll({
    where: { idSeller: idSeller },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
}

async function findByBuyer(idBuyer) {
  return await Transaction.findAll({
    where: { idBuyer: idBuyer },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
}

async function create(transaction) {
  var newtransaction = new Transaction(transaction);
  return await newtransaction.save();
}

module.exports = transactionDao;
