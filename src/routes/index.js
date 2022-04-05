const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", userController.me);
router.get("/users", userController.findUsers);
router.get("/user/:id", userController.findUserById);
router.patch("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUserById);

module.exports = router;
