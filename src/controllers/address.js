const addressDao = require("../daos/address");
const userDao = require("../daos/user");
const Joi = require("joi");

const addressController = {
  findAddressesByUser,
  findShippingAddressesByUser,
  findAddressById,
  createAddress,
  deleteAddress,
};

function findAddressesByUser(req, res) {
  const id = req.user.id;
  userDao
    .findById(id)
    .then((user) => {
      if (!user || !user.profiles[0])
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });

      addressDao
        .findByProfile(user.profiles[0].id)
        .then((addresses) => {
          res.send({
            status: "success",
            data: { addresses },
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

function findShippingAddressesByUser(req, res) {
  const id = req.user.id;
  userDao
    .findById(id)
    .then((user) => {
      if (!user || !user.profiles[0] || !user.profiles[0].idShippingAddress)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      addressDao
        .findById(user.profiles[0].idShippingAddress)
        .then((address) => {
          if (!address)
            return res.status(404).json({
              error: {
                message: "Shipping Address Not exists!",
                "object id": user.profiles[0].idShippingAddress,
              },
            });

          res.send({
            status: "success",
            data: { address },
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

function findAddressById(req, res) {
  const id = req.params.id;
  addressDao
    .findById(id)
    .then((address) => {
      if (!address)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      res.send({
        status: "success",
        data: { address },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function createAddress(req, res) {
  let address = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(address);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  addressDao
    .create(address)
    .then((address) => {
      delete address.dataValues.updatedAt;
      delete address.dataValues.createdAt;
      res.status(201).send({
        status: "success",
        data: { address },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteAddress(req, res) {
  const id = req.params.id;
  addressDao
    .findById(id)
    .then((address) => {
      if (!address)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      addressDao
        .deleteById(id)
        .then((address) => {
          if (address != 1)
            return res.status(404).json({
              error: {
                message: "Not exists!",
                "object id": id,
              },
            });
          res.status(200).json({
            message: "Address deleted successfully",
            data: { "object id": id },
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

module.exports = addressController;
