const provinceDao = require("../daos/province");

const provinceController = {
  findProvinces,
};

function findProvinces(req, res) {
  provinceDao
    .findAll()
    .then((provinces) => {
      res.send({
        status: "success",
        data: { provinces },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = provinceController;
