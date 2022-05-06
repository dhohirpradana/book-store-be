const transactionDao = require("../daos/transaction");
const productDao = require("../daos/book");
const userDao = require("../daos/user");
const Joi = require("joi");
const midtransClient = require("midtrans-client");
const core = new midtransClient.CoreApi();
const nodemailer = require("nodemailer");
const convertRupiah = require("rupiah-format");

core.apiConfig.set({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const transactionController = {
  findTransactions,
  findTransactionById,
  findTransactionSell,
  findTransactionBuy,
  createTransaction,
  notification,
};

async function notification(req, res) {
  try {
    console.log("------- Notification --------- ✅");
    const statusResponse = await core.transaction.notification(req.body);

    const orderId = statusResponse.order_id;

    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        transactionDao.update({ paymentStatus: "pending" }, orderId);
        sendEmail("pending", orderId);
        res.status(200);
      } else if (fraudStatus == "accept") {
        updateProduct(orderId);
        transactionDao.update({ paymentStatus: "success" }, orderId);
        sendEmail("success", orderId);
        res.status(200);
      }
    } else if (transactionStatus == "settlement") {
      updateProduct(orderId);
      transactionDao.update({ paymentStatus: "settlement" }, orderId);
      sendEmail("settlement", orderId);
      res.status(200);
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      transactionDao.update({ paymentStatus: "failed" }, orderId);
      sendEmail("failed", orderId);
      res.status(200);
    } else if (transactionStatus == "pending") {
      transactionDao.update({ paymentStatus: "pending" }, orderId);
      sendEmail("pending", orderId);
      res.status(200);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}

function updateProduct(orderId) {
  productDao
    .findById(orderId)
    .then((product) => {
      console.log(product);
      if (!product)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": orderId,
          },
        });
      const qty = product.qty - 1;
      productDao
        .update({ qty }, orderId)
        .then(() => {
          res.status(200);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

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
      const uploadURL = process.env.UPLOADS;
      transactions = transactions.map((obj) => {
        const image = uploadURL + obj.product.image;
        var product = obj.product;
        product = { ...product.dataValues, image };
        return { ...obj.dataValues, product };
      });
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
    qty: Joi.number().min(1),
    price: Joi.number().min(1).required(),
    courier: Joi.string().min(1).required(),
    costCourier: Joi.number().min(1).required(),
    total: Joi.number().min(1).required(),
  });

  const { error } = schema.validate(transaction);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  transaction.idBuyer = req.user.id;

  userDao
    .findById(req.user.id)
    .then((user) => {
      transactionDao
        .create(transaction)
        .then(async (transaction) => {
          delete transaction.dataValues.updatedAt;
          delete transaction.dataValues.createdAt;
          let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
          });

          let parameter = {
            transaction_details: {
              order_id: transaction.id,
              order_qty: transaction.qty,
              gross_amount: transaction.price,
            },
            credit_card: {
              secure: true,
            },
            customer_details: {
              full_name: user.name,
              email: user.email,
              phone: user.profiles[0].phone ?? 021000,
            },
          };
          const payment = await snap.createTransaction(parameter);
          res.status(201).send({
            status: "pending",
            message: "Pending transaction payment gateway",
            payment,
            product: {
              id: transaction.idProduct,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

const sendEmail = async (status, transactionId) => {
  console.log("sending email...");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SYSTEM_EMAIL,
      pass: process.env.SYSTEM_PASSWORD,
    },
  });

  // Get transaction data
  transactionDao
    .findById(transactionId)
    .then((data) => {
      if (!data) return console.log("No exists data!");
      data = JSON.parse(JSON.stringify(data));
      // Email options content
      const mailOptions = {
        from: process.env.SYSTEM_EMAIL,
        to: data.buyer.email,
        subject: "Payment status",
        text: "Your payment is <br />" + status,
        html: `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                  h1 {
                    color: brown;
                  }
                </style>
              </head>
              <body>
                <h2>Product payment :</h2>
                <ul style="list-style-type:none;">
                  <li>Name : ${data.product.name}</li>
                  <li>Total payment: ${convertRupiah.convert(data.price)}</li>
                  <li>Status : <b>${status}</b></li>
                </ul>  
              </body>
            </html>`,
      };
      if (data.paymentStatus != status) {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) throw err;
          console.log("Email sent: " + info.response);
          return res.send({
            status: "Success",
            message: info.response,
          });
        });
      }
    })
    .catch((error) => console.log(error));
};

module.exports = transactionController;

// res.status(201).send({
//   status: "success",
//   data: { transaction },
// });
// })
