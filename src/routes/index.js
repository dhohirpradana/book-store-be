const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const productController = require("../controllers/product");
const categoryController = require("../controllers/category");
const { verifyAdmin, verifyToken } = require("../middleware/auth");

//! User
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", verifyToken, userController.me);
// router.patch("/me", verifyToken, userController.meUpdate);
// router.delete("/me", verifyToken, userController.meDelete);
router.get("/user/:id", verifyToken, userController.findUserById);

router.patch("/user/:id", verifyAdmin, userController.updateUser);
router.delete("/user/:id", verifyAdmin, userController.deleteUserById);
router.get("/users", verifyAdmin, userController.findUsers);

//! Product
router.get("/products", productController.findProducts);
router.get("/product/:id", productController.findProductById);
router.post("/products", verifyToken, productController.createProduct);
router.patch("/product/:id", verifyToken, productController.updateProduct);
router.delete("/product/:id", verifyToken, productController.deleteProduct);

//! Category
router.get("/categories", categoryController.findCategories);
router.get("/category/:id", categoryController.findCategoryById);
router.post("/category", verifyToken, categoryController.createCategory);
router.patch("/category/:id", verifyAdmin, categoryController.updateCategory);
router.delete("/category/:id", verifyAdmin, categoryController.deleteCategory);

module.exports = router;
