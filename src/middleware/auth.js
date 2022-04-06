const jwt = require("jsonwebtoken");
const config = process.env;

const auth = { verifyToken, verifyAdmin };

function verifyToken(req, res, next) {
  const raw = req.header("Authorization") || req.query.access_token;

  const token = raw && raw.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(403).send({
      error: {
        message: "A token is required for authentication",
      },
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  return next();
}

function verifyAdmin(req, res, next) {
  const raw = req.headers["x-access-token"] || req.query.access_token;

  const token = raw.split(" ")[1];

  if (!token) {
    return res.status(403).send({
      error: {
        message: "A token is required for authentication",
      },
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    console.log(decoded);
    if (decoded.role < 3) {
      return res.status(401).json({ error: { message: "Unauthorized" } });
    }
  } catch (err) {
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  return next();
}

module.exports = auth;
