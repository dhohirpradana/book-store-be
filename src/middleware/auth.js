const jwt = require("jsonwebtoken");
const config = process.env;

const auth = { verifyToken, verifyAdmin };

function verifyToken(req, res) {
  const token =
    req.body.access_token ||
    req.query.access_token ||
    req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      status: "error",
      message: "A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  return req.user;
}

function verifyAdmin(req, res, next) {
  const token =
    req.body.access_token ||
    req.query.access_token ||
    req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      status: "error",
      message: "A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    console.log(decoded);
    if (decoded.role != "admin") {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  return next();
}

module.exports = auth;
