const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const productController = require("../controllers/product");
const { verifyAdmin, verifyToken } = require("../middleware/auth");

// User
router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/me", verifyToken, userController.me);
// router.patch("/me", verifyToken, userController.meUpdate);
// router.delete("/me", verifyToken, userController.meDelete);
router.get("/user/:id", verifyToken, userController.findUserById);

router.patch("/user/:id", verifyAdmin, userController.updateUser);
router.delete("/user/:id", verifyAdmin, userController.deleteUserById);
router.get("/users", verifyAdmin, userController.findUsers);

// Product
router.get("/products", productController.findProducts);
//
router.post("/products", verifyToken, productController.create);

module.exports = router;
