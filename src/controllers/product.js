const productDao = require("../daos/product");
const userDao = require("../daos/user");
const addressDao = require("../daos/address");
const Joi = require("joi");

const productController = {
  findProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

function findProducts(req, res) {
  productDao
    .findAll()
    .then((products) => {
      const uploadURL = process.env.UPLOADS;
      products = products.map((obj) => {
        const image = uploadURL + obj.image;
        return { ...obj.dataValues, image };
      });
      res.send({
        status: "success",
        data: { products: products },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function findProductById(req, res) {
  const id = req.params.id;
  productDao
    .findById(id)
    .then((product) => {
      if (!product)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      userDao
        .findById(product.idUser)
        .then((user) => {
          if (!user || !user.profiles[0])
            return res.status(404).json({
              error: {
                message: "Not exists!",
                "object id": product.idUser,
              },
            });
          addressDao
            .findById(user.profiles[0].idShippingAddress)
            .then((address) => {
              if (!address)
                return res.status(404).json({
                  error: {
                    message: "Product Address Not exists!",
                    "object id": user.profiles[0].idShippingAddress,
                  },
                });
              delete product.dataValues.idUser;
              product.dataValues.address = address;
              product.dataValues.image =
                process.env.UPLOADS + product.dataValues.image;
              res.send({
                status: "success",
                data: { product },
              });
            })
            .catch((error) => {
              console.log(error);
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

function createProduct(req, res) {
  let product = req.body;
  product.image = req.file.filename;

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    desc: Joi.string().min(3).required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    qty: Joi.number().min(1).required(),
  });

  const { error } = schema.validate(product);
  product.idUser = req.user.id;

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  productDao
    .create(product)
    .then((product) => {
      product.dataValues.user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        image: "user_" + req.user.id + ".jpg",
      };
      res.status(201).send({
        status: "success",
        data: { product },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateProduct(req, res) {
  const id = req.params.id;
  const product = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3),
    desc: Joi.string().min(3),
    price: Joi.number(),
    image: Joi.string(),
    qty: Joi.number().min(1),
  });

  const { error } = schema.validate(product);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  productDao
    .findById(id)
    .then((product) => {
      if (!product)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      if (req.user.id != product.idUser)
        return res.status(403).json({
          error: {
            message: "Forbidden!",
          },
        });

      delete product.dataValues.idUser;
      for (const [key, value] of Object.entries(req.body)) {
        product.dataValues[key] = value;
      }
      productDao
        .update(req.body, id)
        .then(() => {
          res.status(200).json({
            message: "Product updated successfully",
            data: { product },
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

function deleteProduct(req, res) {
  const id = req.params.id;
  productDao
    .findById(id)
    .then((product) => {
      if (!product)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      if (req.user.id != product.idUser)
        return res.status(403).json({
          error: {
            message: "Forbidden!",
          },
        });

      productDao
        .deleteById(id)
        .then((product) => {
          res.status(200).json({
            message: "Product deleted successfully",
            data: { product },
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

module.exports = productController;
