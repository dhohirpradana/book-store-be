const { Book, Category } = require("../../models");
const bookDao = {
  findAll,
  create,
  findById,
  deleteById,
  update,
};

async function findAll() {
  return await Book.findAll({
    attributes: { exclude: ["idUser", "createdAt", "updatedAt"] },
    include: {
      model: Category,
      as: "categories",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });
}

async function findById(id) {
  return await Book.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
}

async function deleteById(id) {
  return await Book.destroy({ where: { id: id } });
}

async function create(book) {
  var newbook = new Book(book);
  return await newbook.save();
}

async function update(book, id) {
  return await Book.update(book, { where: { id } });
}

module.exports = bookDao;
