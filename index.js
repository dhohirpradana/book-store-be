const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();

const db = require("./models");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/", require("./src/routes/index"));
app.use('/uploads', express.static('uploads'));

const API_PORT = process.env.API_PORT;
const port = API_PORT || 3000;

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, console.log(`Server started on port ${port}`));
  })
  .catch((err) => console.log("Error: " + err));
