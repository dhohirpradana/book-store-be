const { User, Address } = require("../../models");
const userDao = {
  findAll,
  findAllAdmin,
  findAllCustomer,
  findEmail,
  create,
  findById,
  deleteById,
  update,
};

async function findAll() {
  return await User.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    include: {
      model: Address,
      as: "address",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });
}

async function findAllAdmin() {
  return await User.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    include: {
      model: Address,
      as: "address",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
    where: {
      role: "admin",
    },
  });
}

async function findAllCustomer() {
  return await User.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    include: {
      model: Address,
      as: "address",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
    where: {
      role: "customer",
    },
  });
}

async function findEmail(email) {
  return await User.findOne({
    where: { email },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
}

async function findById(id) {
  return await User.findByPk(id, {
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
    include: {
      model: Address,
      as: "address",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });
}

async function deleteById(id) {
  return await User.destroy({ where: { id: id } });
}

async function create(data) {
  var newuser = new User(data);
  return await newuser.save();
}

async function update(user, id) {
  return await User.update(user, { where: { id } });
}

module.exports = userDao;
