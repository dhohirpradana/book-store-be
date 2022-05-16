const cartDao = require("../daos/cart");
const userDao = require("../daos/user");
const addressDao = require("../daos/address");
const Joi = require("joi");

const cartController = {
  findCartByUser,
  findCartById,
  createCart,
  deleteCart,
  deleteCarts,
};

function findCartByUser(req, res) {
  let id = req.user.id;
  cartDao
    .findByUser(id)
    .then((carts) => {
      carts = carts.map((obj) => {
        const uploadURL = process.env.UPLOADS;
        const image = !obj.book.image
          ? null
          : uploadURL + "image/" + obj.book.image;
        return { ...obj.dataValues, book: { ...obj.book.dataValues, image } };
      });
      res.send({
        status: "success",
        data: { carts: carts },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function findCartById(req, res) {
  const id = req.params.id;
  cartDao
    .findById(id)
    .then((cart) => {
      if (!cart)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      userDao
        .findById(cart.userId)
        .then((user) => {
          if (!user)
            return res.status(404).json({
              error: {
                message: "Not exists!",
                "object id": cart.userId,
              },
            });
          res.send({
            status: "success",
            data: { cart },
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

function createCart(req, res) {
  let cart = req.body;
  const schema = Joi.object({
    bookId: Joi.number().min(1).required(),
  });

  const { error } = schema.validate(cart);
  cart.userId = req.user.id;

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  cartDao
    .create(cart)
    .then((cart) => {
      res.status(201).send({
        status: "success",
        data: { cart },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteCart(req, res) {
  const id = req.params.id;
  cartDao
    .findById(id)
    .then((cart) => {
      if (!cart)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      if (req.user.id != cart.userId)
        return res.status(403).json({
          error: {
            message: "Forbidden!",
          },
        });

      cartDao
        .deleteById(id)
        .then(() => {
          res.status(200).json({
            message: "cart deleted successfully",
            "object id": id,
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

function deleteCarts(req, res) {
  const id = req.user.id;

  cartDao
    .deleteByUserId(id)
    .then(() => {
      res.status(200).json({
        message: "carts deleted successfully",
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = cartController;
