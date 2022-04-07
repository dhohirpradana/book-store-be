const transactionDao = require("../daos/transaction");
const Joi = require("joi");

const transactionController = {
  findTransactions,
  findTransactionById,
  findTransactionSell,
  findTransactionBuy,
  createTransaction,
};

function findTransactions(req, res) {
  transactionDao
    .findAll()
    .then((transactions) => {
      res.send({
        status: "success",
        data: { transactions },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function findTransactionById(req, res) {
  const id = req.params.id;
  transactionDao
    .findById(id)
    .then((transaction) => {
      if (!transaction)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      if (
        !(
          transaction.idUser == req.user.id ||
          transaction.idSeller == req.user.id
        )
      )
        return res.status(404).json({
          error: {
            message: "Forbidden!",
            "object id": id,
          },
        });

      res.send({
        status: "success",
        data: { transaction },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function findTransactionSell(req, res) {
  const id = req.user.id;
  console.log(req.user.id);
  transactionDao
    .findBySeller(id)
    .then((transactions) => {
      if (!transactions)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      res.send({
        status: "success",
        data: { transactions },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function findTransactionBuy(req, res) {
  const id = req.user.id;
  transactionDao
    .findByBuyer(id)
    .then((transactions) => {
      if (!transactions)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      res.send({
        status: "success",
        data: { transactions },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function createTransaction(req, res) {
  let transaction = req.body;

  const schema = Joi.object({
    idProduct: Joi.number().min(1).required(),
    idSeller: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
  });

  const { error } = schema.validate(transaction);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  transaction.idBuyer = req.user.id;
  
  transactionDao
    .create(transaction)
    .then((transaction) => {
      delete transaction.dataValues.updatedAt;
      delete transaction.dataValues.createdAt;
      res.status(201).send({
        status: "success",
        data: { transaction },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = transactionController;
