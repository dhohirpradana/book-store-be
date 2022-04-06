const { user, role } = require("../../models");
const userDao = {
  findAll,
  findEmail,
  create,
  findById,
  deleteById,
  update,
};

async function findAll() {
  return await user.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    include: {
      model: role,
      as: "user_role",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });
}

async function findEmail(email) {
  return await user.findOne({
    where: { email },
    attributes: { exclude: ["role", "createdAt", "updatedAt"] },
    include: {
      model: role,
      as: "user_role",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });
}

async function findById(id) {
  return await user.findByPk(id, {
    attributes: {
      exclude: ["role", "password", "createdAt", "updatedAt"],
    },
    include: {
      model: role,
      as: "user_role",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });
}

async function deleteById(id) {
  return await user.destroy({ where: { id: id } });
}

async function create(data) {
  var newuser = new user(data);
  return await newuser.save();
}

async function update(data, id) {
  return await user.update(data, { where: { id } });
}

module.exports = userDao;
