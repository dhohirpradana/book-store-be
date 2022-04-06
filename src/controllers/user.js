const userDao = require("../daos/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userController = {
  register,
  login,
  me,
  findUsers,
  findUserById,
  updateUser,
  deleteUserById,
};

function register(req, res) {
  let user = req.body;

  if (!(user.name && user.email && user.password)) {
    res.status(400).send({ error: { message: "All input is required" } });
  }

  userDao.findEmail(user.email).then(async (isExistsEmail) => {
    if (isExistsEmail) {
      return res
        .status(409)
        .json({ error: { message: "Email has already been taken" } });
    } else {
      const encryptedPassword = await bcrypt.hash(user.password, 10);
      user.password = encryptedPassword;
      userDao
        .create(user)
        .then((user) => {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          res.status(201).json({
            status: "success",
            data: { user: { name: user.name, email: user.email, token } },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!(email && password)) {
    res.status(400).send({ error: { message: "All input is required" } });
  }
  userDao
    .findEmail(email)
    .then(async (user) => {
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { id: user.id, name: user.name, email, role: user.role },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        delete user.dataValues.password;
        delete user.dataValues.role;
        user.token = token;
        return res.status(200).json({
          status: "success",
          data: {
            user: {
              user,
              token,
            },
          },
        });
      }
      res.status(400).send({ error: { message: "Invalid Credentials" } });
    })
    .catch((error) => {
      console.log(error);
    });
}

function me(req, res) {
  const userId = req.user.id;
  if (userId) {
    userDao
      .findById(userId)
      .then((user) => {
        res.status(200).json({
          status: "success",
          data: {
            user,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    res.status(400).send({ error: { message: "Invalid Credentials" } });
  }
}

function findUserById(req, res) {
  userDao
    .findById(req.params.id)
    .then((user) => {
      res.send({
        status: "success",
        data: { user },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// Admin

function deleteUserById(req, res) {
  userDao
    .deleteById(req.params.id)
    .then((user) => {
      res.status(200).json({
        message: "User deleted successfully",
        data: { user },
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
          message: "User updated successfully",
          data: { user: { id, ...req.body } },
        });
      } else {
        res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function findUsers(req, res) {
  if (req.role > 2) {
    return res.status(403).json({
      error: {
        message: "Forbidden!",
      },
    });
  }
  userDao
    .findAll()
    .then((users) => {
      res.send({
        status: "success",
        data: { users },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = userController;
