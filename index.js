const express = require("express");
const app = express();
const port = 5000;

app.use(express.json);

app.get("/", (req, res) => {
  res.json({ data: "ini adalah data" });
});

app.listen(port);
