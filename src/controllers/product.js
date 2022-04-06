const productDao = require("../daos/product");
const Joi = require("joi");

const userController = {
  findProducts,
  findProductById,
  create,
  updateProduct,
  deleteProduct,
};

function findProducts(req, res) {
  productDao
    .findAll()
    .then((products) => {
      res.send({
        status: "success",
        data: { products },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function findProductById(req, res) {
  productDao
    .findById(req.params.id)
    .then((product) => {
      res.send({
        status: "success",
        data: { product },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// Admin/ Owner

function create(req, res) {
  let product = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    desc: Joi.string().min(3).required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    qty: Joi.number().min(1).required(),
    // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });

  const { error } = schema.validate(product);
  product.idUser = req.user.id;

  if (error) {
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });
  }

  productDao
    .create(product)
    .then((product) => {
      product.dataValues.user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      };
      delete product.dataValues.idUser;
      delete product.dataValues.updatedAt;
      delete product.dataValues.createdAt;
      res.status(201).send({
        status: "success",
        data: { product },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteProduct(req, res) {
  productDao
    .deleteById(req.params.id)
    .then((product) => {
      res.status(200).json({
        message: "User deleted successfully",
        data: { product },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateProduct(req, res) {
  const id = req.params.id;

  const schema = Joi.object({
    name: Joi.string().min(3),
    desc: Joi.string().min(3),
    price: Joi.number(),
    image: Joi.string(),
    qty: Joi.number().min(1),
    // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });

  if (error) {
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });
  }

  const { error } = schema.validate(product);

  productDao
    .update(req.body, id)
    .then((product) => {
      if (product == 1) {
        res.status(200).json({
          message: "User updated successfully",
          data: { product: { id, ...req.body } },
        });
      } else {
        res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = userController;
