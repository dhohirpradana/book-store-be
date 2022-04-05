const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./models");
const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors("*"));

app.use("/api/v1/", require("./src/routes/index"));

const API_PORT = process.env.API_PORT;
const port = API_PORT || 3000;

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, console.log(`Server started on port ${port}`));
  })
  .catch((err) => console.log("Error: " + err));
