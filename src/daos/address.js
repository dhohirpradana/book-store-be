const { Address, City } = require("../../models");
const addressDao = { findByUser, create, findById, deleteById };

async function findByUser(userId) {
  return await Address.findOne({
    where: { userId },
    attributes: { exclude: ["userId", "cityId", "createdAt", "updatedAt"] },
    include: {
      model: City,
      as: "city",
      attributes: { exclude: ["provinceId","createdAt", "updatedAt"] },
    },
  });
}

async function findById(id) {
  return await Address.findByPk(id, {
    attributes: {
      exclude: ["userId", "cityId", "createdAt", "updatedAt"],
    },
    include: {
      model: City,
      as: "city",
      attributes: { exclude: ["provinceId", "createdAt", "updatedAt"] },
    },
  });
}

async function deleteById(id) {
  return await Address.destroy({ where: { id: id } });
}

async function create(data) {
  var newaddress = new Address(data);
  return await newaddress.save();
}

module.exports = addressDao;
