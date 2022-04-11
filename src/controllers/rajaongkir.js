const { init } = require("rajaongkir-node-js");
const request = init("b8eba92d36a6fde3e80141785d66fb31", "starter");

const rajaOngkirController = {
  getProvince,
  getAllCityInProvince,
  getCost,
};

function getProvince(req, res) {
  const province = request.get("/province").then((prov) => {
    res.send(prov);
  });
}

function getAllCityInProvince(req, res) {
  let provinceId = req.params.provinceId;
  request.get(`/city?&province=${provinceId}`).then((city) => {
    return res.send(city);
  });
}

// http://localhost:8080/cost/jne?destination=134&origin=2&weight=1000
function getCost(req, res) {
  let courier = req.params.courier;
  let origin = req.query.origin;
  let destination = req.query.destination;
  let weight = req.query.weight ?? 1000;
  const data = {
    origin,
    destination,
    weight,
    courier,
  };
  request.post("cost", data).then((cost) => {
    res.send(cost);
  });
}

module.exports = rajaOngkirController;
