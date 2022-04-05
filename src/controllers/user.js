const userDao = require("../daos/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const userController = {
  register,
  login,
  me,
  findUsers,
  findUserById,
  updateUser,
  deleteUserById,
};

async function register(req, res) {
  let user = req.body;

  if (!(user.name && user.email && user.password)) {
    res.status(400).send({ status: "error", message: "All input is required" });
  }

  const emailIsExists = await userDao.findOne(user.email);

  if (emailIsExists) {
    return res
      .status(409)
      .json({ status: "error", message: "Email has already been taken" });
  } else {
    const encryptedPassword = await bcrypt.hash(user.password, 10);
    user.password = encryptedPassword;
    userDao
      .create(user)
      .then((user) => {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        res.status(200).json({
          status: "success",
          data: { user: { name: user.name, email: user.email, token } },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!(email && password)) {
    res.status(400).send({ status: "error", message: "All input is required" });
  }
  userDao
    .findOne(email)
    .then(async (user) => {
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user.id, email }, process.env.TOKEN_KEY, {
          expiresIn: "2h",
        });
        user.token = token;
        return res.status(200).json({
          status: "success",
          data: {
            user: {
              name: user.name,
              email: user.email,
              status: user.role,
              token,
            },
          },
        });
      }
      res.status(400).send({ status: "error", message: "Invalid Credentials" });
    })
    .catch((error) => {
      console.log(error);
    });
}

function me(req, res) {
  const userId = auth.verifyToken(req, res).id;
  if (userId)
    userDao
      .findById(userId)
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        console.log(error);
      });
}

function findUserById(req, res) {
  userDao
    .findById(req.params.id)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteUserById(req, res) {
  userDao
    .deleteById(req.params.id)
    .then((user) => {
      res.status(200).json({
        message: "user deleted successfully",
        user: user,
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateUser(req, res) {
  const id = req.params.id;
  userDao
    .update(req.body, id)
    .then((user) => {
      if (user == 1) {
        res.status(200).json({
          message: "user updated successfully",
          user: { id, ...req.body },
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Not exists!",
          "object id": id,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function findUsers(req, res) {
  const isAdmin = auth.verifyToken(req, res).role == "admin";
  if (!isAdmin) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden!",
    });
  }
  userDao
    .findAll()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = userController;
