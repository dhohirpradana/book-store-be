const subDistrictDao = require("../daos/subdistrict");

const subDistrictController = {
  findSubdistricts,
};

function findSubdistricts(req, res) {
  const cityId = req.params.cityId;
  subDistrictDao
    .findByCityId(cityId)
    .then((subdistricts) => {
      res.send({
        status: "success",
        data: { subdistricts },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = subDistrictController;
