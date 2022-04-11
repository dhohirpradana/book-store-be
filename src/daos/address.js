const { Address } = require("../../models");
const addressDao = { findByProfile, create, findById, deleteById };

async function findByProfile(idProfile) {
  return await Address.findAll({
    where: { idProfile },
    attributes: { exclude: ["idProfile", "createdAt", "updatedAt"] },
  });
}

async function findById(id) {
  return await Address.findByPk(id, {
    attributes: {
      exclude: ["idProfile", "createdAt", "updatedAt"],
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
