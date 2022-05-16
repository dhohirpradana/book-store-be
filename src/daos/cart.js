const { Cart, Book } = require("../../models");
const cartDao = {
  // findAll,
  findByUser,
  create,
  findById,
  deleteById,
  update,
  deleteByUserId,
};

async function findAll() {
  return await Cart.findAll({
    attributes: { exclude: ["idUser", "createdAt", "updatedAt"] },
  });
}

async function findById(id) {
  return await Cart.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
}

async function findByUser(userId) {
  return await Cart.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: {
      model: Book,
      as: "book",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
    where: { userId },
  });
}

async function deleteById(id) {
  return await Cart.destroy({ where: { id: id } });
}

async function deleteByUserId(buyerId) {
  return await Cart.destroy({ where: { userId: buyerId } });
}

async function create(cart) {
  var newcart = new Cart(cart);
  return await newcart.save();
}

async function update(cart, id) {
  return await Cart.update(cart, { where: { id } });
}

module.exports = cartDao;
