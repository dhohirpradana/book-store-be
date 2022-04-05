const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { verifyAdmin } = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", userController.me);
router.patch("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUserById);
router.get("/user/:id", userController.findUserById);

router.get("/users", verifyAdmin, userController.findUsers);

module.exports = router;
