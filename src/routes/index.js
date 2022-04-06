const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { verifyAdmin, verifyToken } = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/me", verifyToken, userController.me);
router.patch("/me", verifyToken, userController.me);
router.delete("/me", verifyToken, userController.me);
router.get("/user/:id", verifyToken, userController.findUserById);

router.patch("/user/:id", verifyAdmin, userController.updateUser);
router.delete("/user/:id", verifyAdmin, userController.deleteUserById);
router.get("/users", verifyAdmin, userController.findUsers);

module.exports = router;
