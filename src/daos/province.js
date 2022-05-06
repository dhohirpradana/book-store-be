const { Province } = require("../../models");
const provinceDao = { findAll, create, findById, deleteById };

async function findAll() {
  return await Province.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
}

async function findById(id) {
  return await Province.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
}

async function deleteById(id) {
  return await Province.destroy({ where: { id: id } });
}

async function create(data) {
  var newprovince = new Province(data);
  return await newprovince.save();
}

module.exports = provinceDao;
