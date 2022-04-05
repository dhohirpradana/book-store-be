const db = require("../../models");
const userDao = {
  findAll,
  findOne,
  create,
  findById,
  deleteById,
  update,
};

function findAll() {
  return db.User.findAll();
}

function findOne(email) {
  const user = db.User.findOne({ where: { email } });
  return user;
}

function findById(id) {
  return db.User.findByPk(id);
}

function deleteById(id) {
  return db.User.destroy({ where: { id: id } });
}

function create(user) {
  var newuser = new db.User(user);
  return newuser.save();
}

function update(user, id) {
  var updateuser = { ...user };
  return db.User.update(updateuser, { where: { id: id } });
}
module.exports = userDao;
