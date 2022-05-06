const { City } = require("../../models");
const provinceDao = { findAll, findByProvinceId, create, findById, deleteById };

async function findAll() {
  return await City.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
}

async function findById(id) {
  return await City.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
}

async function findByProvinceId(provinceId) {
  return await City.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    where: {
      provinceId: provinceId,
    },
  });
}

async function deleteById(id) {
  return await City.destroy({ where: { id: id } });
}

async function create(data) {
  var newprovince = new City(data);
  return await newprovince.save();
}

module.exports = provinceDao;
