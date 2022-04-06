const { Category } = require("../../models");
const categoryDao = {
  findAll,
  create,
  findById,
  findName,
  deleteById,
  update,
};

async function findAll() {
  return await Category.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
}

async function findById(id) {
  return await Category.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
}

async function findName(name) {
  return await Category.findOne({
    where: { name },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
}

async function create(category) {
  var newuser = new Category(category);
  return await newuser.save();
}

async function update(category, id) {
  return await Category.update(category, { where: { id } });
}

async function deleteById(id) {
  return await Category.destroy({
    where: { id: id },
    ctruncate: true,
    cascade: false,
  });
}

module.exports = categoryDao;
