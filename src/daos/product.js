const { Product } = require("../../models");
const productDao = {
  findAll,
  create,
  findById,
  deleteById,
  update,
};

async function findAll() {
  return await Product.findAll({
    attributes: { exclude: ["idUser", "createdAt", "updatedAt"] },
  });
}

async function findById(id) {
  return await Product.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
}

async function deleteById(id) {
  return await Product.destroy({ where: { id: id } });
}

async function create(product) {
  var newuser = new Product(product);
  return await newuser.save();
}

async function update(product, id) {
  return await Product.update(product, { where: { id } });
}

module.exports = productDao;
