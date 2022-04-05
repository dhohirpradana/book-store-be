const { User } = require("../../models");
const userDao = {
  findAll,
  findOne,
  create,
  findById,
  deleteById,
  update,
};

function findAll() {
  return User.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  });
}

function findOne(email) {
  const user = User.findOne({
    where: { email },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return user;
}

function findById(id) {
  return User.findByPk(id, {
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  });
}

function deleteById(id) {
  return User.destroy({ where: { id: id } });
}

function create(user) {
  var newuser = new User(user);
  return newuser.save();
}

function update(user, id) {
  return User.update(user, { where: { id } });
}
module.exports = userDao;
