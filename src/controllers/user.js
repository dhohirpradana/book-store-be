const userDao = require("../daos/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

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

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  const { error } = schema.validate(user);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  userDao.findEmail(user.email).then(async (isExistsEmail) => {
    if (isExistsEmail)
      return res.status(409).json({
        error: {
          message: "Email has already been taken",
          data: { email: user.email },
        },
      });

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
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const schema = Joi.object({
    email: Joi.string().min(1).required(),
    password: Joi.string().min(1).required(),
  });

  const { error } = schema.validate(req.body);

  if (error)
    return res
      .status(400)
      .send({ error: { message: error.details[0].message } });

  userDao
    .findEmail(email)
    .then(async (user) => {
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { id: user.id, name: user.name, email, role: user.role.id },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        delete user.dataValues.password;
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
  if (userId)
    return res.status(400).send({ error: { message: "Invalid Credentials" } });
  userDao
    .findById(userId)
    .then((user) => {
      if (user != 1)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
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
}

function findUserById(req, res) {
  const id = req.params.id;
  userDao
    .findById(id)
    .then((user) => {
      if (user != 1)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
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
  const id = req.params.id;
  userDao
    .deleteById(id)
    .then((user) => {
      if (user != 1)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
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
      if (user != 1)
        return res.status(404).json({
          error: {
            message: "Not exists!",
            "object id": id,
          },
        });
      res.status(200).json({
        message: "User updated successfully",
        data: { user: { id, ...req.body } },
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function findUsers(req, res) {
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
