const { User, Role, Profile, Gender } = require("../../models");
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
    attributes: { exclude: ["idRole", "password", "createdAt", "updatedAt"] },
    include: {
      model: Role,
      as: "role",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });
}

async function findAllAdmin() {
  return await User.findAll({
    attributes: { exclude: ["idRole", "password", "createdAt", "updatedAt"] },
    include: [
      {
        model: Role,
        as: "role",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Profile,
        as: "profiles",
        include: [
          {
            model: Gender,
            as: "gender",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    where: {
      idRole: 4,
    },
  });
}

async function findAllCustomer() {
  return await User.findAll({
    attributes: { exclude: ["idRole", "password", "createdAt", "updatedAt"] },
    include: [
      {
        model: Role,
        as: "role",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Profile,
        as: "profiles",
        include: [
          {
            model: Gender,
            as: "gender",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    where: {
      idRole: 1,
    },
  });
}

async function findEmail(email) {
  return await User.findOne({
    where: { email },
    attributes: { exclude: ["idRole", "createdAt", "updatedAt"] },
    include: {
      model: Role,
      as: "role",
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });
}

async function findById(id) {
  return await User.findByPk(id, {
    attributes: {
      exclude: ["idRole", "password", "createdAt", "updatedAt"],
    },
    include: [
      {
        model: Role,
        as: "role",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Profile,
        as: "profiles",
        include: [
          {
            model: Gender,
            as: "gender",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
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
