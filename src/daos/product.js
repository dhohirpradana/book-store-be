const { product, productCategory } = require("../../models");
const productDao = {
  findAll,
  create,
  findById,
  deleteById,
  update,
};

async function findAll() {
  return await product.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
}

async function findById(id) {
  return await product.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    // include: {
    //   model: role,
    //   as: "user_role",
    //   attributes: { exclude: ["createdAt", "updatedAt"] },
    // },
  });
}

async function deleteById(id) {
  return await product.destroy({ where: { id: id } });
}

async function create(data) {
  var newuser = new product(data);
  return await newuser.save();
}

async function update(data, id) {
  return await product.update(data, { where: { id } });
}

module.exports = productDao;
