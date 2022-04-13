const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

const db = require("./models");
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/", urlencodedParser, require("./src/routes/index"));
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 3000;

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, console.log(`Server started on port ${port}`));
  })
  .catch((err) => console.log("Error: " + err));
