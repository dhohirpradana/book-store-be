const transactionDao = require("../daos/transaction");
const bookDao = require("../daos/book");
const userDao = require("../daos/user");
const Joi = require("joi");
const midtransClient = require("midtrans-client");
const core = new midtransClient.CoreApi();
const nodemailer = require("nodemailer");
const convertRupiah = require("rupiah-format");
// const { v4: uuidv4 } = require("uuid");

core.apiConfig.set({
  isbookion: false,
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
    console.log(statusResponse);

    const orderId = statusResponse.order_id;

    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        transactionDao
          .update({ status: "challenge" }, orderId)
          .then((transaction) => {
            console.log(transaction);
          })
          .catch((err) => console.log(err));
        sendEmail("pending", orderId);
        res.status(200);
      } else if (fraudStatus == "accept") {
        updatebook(orderId);
        transactionDao
          .update({ status: "success" }, orderId)
          .then((transaction) => {
            console.log(transaction);
          })
          .catch((err) => console.log(err));
        sendEmail("success", orderId);
        res.status(200);
      }
    } else if (transactionStatus == "settlement") {
      updatebook(orderId);
      transactionDao
        .update({ status: "settlement" }, orderId)
        .then((transaction) => {
          console.log(transaction);
        })
        .catch((err) => console.log(err));
      sendEmail("settlement", orderId);
      res.status(200);
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      transactionDao
        .update({ status: "failed" }, orderId)
        .then((transaction) => {
          console.log(transaction);
        })
        .catch((err) => console.log(err));
      sendEmail("failed", orderId);
      res.status(200);
    } else if (transactionStatus == "pending") {
      transactionDao
        .update({ status: "pending" }, orderId)
        .then((transaction) => {
          console.log(transaction);
        })
        .catch((err) => console.log(err));
      sendEmail("pending", orderId);
      res.status(200);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
}

function updatebook(orderId) {
  bookDao
    .findById(orderId)
    .then((book) => {
      // console.log(book);
      if (!book)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": orderId,
          },
        });
      const qty = book.qty - 1;
      bookDao
        .update({ qty }, orderId)
        .then((book) => {
          console.log(book);
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
          transaction.buyerId == req.user.id ||
          transaction.sellerId == req.user.id
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
        const image = uploadURL + obj.book.image;
        var book = obj.book;
        book = { ...book.dataValues, image };
        return { ...obj.dataValues, book };
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
    bookId: Joi.number().min(1).required(),
    sellerId: Joi.number().min(1).required(),
    count: Joi.number().min(1),
    origin: Joi.number().min(1).required(),
    destination: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
    courier: Joi.string().min(1).required(),
    transactionId: Joi.string().min(1).required(),
    courierCost: Joi.number().min(1).required(),
    subTotal: Joi.number().min(1).required(),
  });

  const { error } = schema.validate(transaction);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  transaction.buyerId = req.user.id;

  userDao
    .findById(req.user.id)
    .then((user) => {
      transactionDao
        .create(transaction)
        .then(async (transaction) => {
          delete transaction.dataValues.updatedAt;
          delete transaction.dataValues.createdAt;
          let snap = new midtransClient.Snap({
            isbookion: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
          });

          let parameter = {
            transaction_details: {
              order_id: req.body.transactionId,
              order_qty: transaction.count,
              gross_amount: transaction.subTotal,
            },
            credit_card: {
              secure: true,
            },
            customer_details: {
              full_name: user.name,
              email: user.email,
              phone: user.phone ?? 0,
            },
          };
          const payment = await snap.createTransaction(parameter);
          res.status(201).send({
            status: "pending",
            message: "Pending transaction payment gateway",
            payment,
            book: {
              id: transaction.bookId,
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
                <h2>book payment :</h2>
                <ul style="list-style-type:none;">
                  <li>Name : ${data.book.title}</li>
                  <li>Total payment: ${convertRupiah.convert(
                    data.subTotal
                  )}</li>
                  <li>Status : <b>${status}</b></li>
                </ul>  
              </body>
            </html>`,
      };
      if (data.status != status) {
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
