const cityDao = require("../daos/city");

const cityController = {
  findCities,
};

function findCities(req, res) {
  const provinceId = req.params.provinceId;
  cityDao
    .findByProvinceId(provinceId)
    .then((cities) => {
      res.send({
        status: "success",
        data: { cities },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = cityController;
