const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { verifyAdmin, verifyToken } = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", verifyToken, userController.me);

router.patch("/user/:id", verifyToken, userController.updateUser);
router.delete("/user/:id", verifyToken, userController.deleteUserById);
router.get("/user/:id", verifyToken, userController.findUserById);

router.get("/users", verifyAdmin, userController.findUsers);

module.exports = router;
