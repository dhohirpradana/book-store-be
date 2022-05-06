const { SubDistrict } = require("../../models");
const subDistrictDao = { findAll, findByCityId, create, findById, deleteById };

async function findAll() {
  return await SubDistrict.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
}

async function findById(id) {
  return await SubDistrict.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
}

async function findByCityId(cityId) {
  return await SubDistrict.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    where: {
      cityId: cityId,
    },
  });
}

async function deleteById(id) {
  return await SubDistrict.destroy({ where: { id: id } });
}

async function create(data) {
  var newprovince = new SubDistrict(data);
  return await newprovince.save();
}

module.exports = subDistrictDao;
