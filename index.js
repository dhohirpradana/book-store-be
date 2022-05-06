const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const { Server } = require("socket.io");
var http = require("http");

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
app.post("/profile");
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

require("./src/socket")(io);

const port = process.env.PORT || 5000;

db.sequelize
  .sync()
  .then(() => {
    server.listen(port, console.log(`Server started on port ${port}`));
  })
  .catch((err) => console.log("Error: " + err));
