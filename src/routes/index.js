const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const productController = require("../controllers/product");
const categoryController = require("../controllers/category");
const transactionController = require("../controllers/transaction");
const { verifyAdmin, verifyUser } = require("../middleware/auth");

//! User
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", verifyUser, userController.me);
router.get("/user/:id", verifyUser, userController.findUserById);
// router.patch("/me", verifyUser, userController.meUpdate);
// router.delete("/me", verifyUser, userController.meDelete);

router.patch("/user/:id", verifyAdmin, userController.updateUser);
router.delete("/user/:id", verifyAdmin, userController.deleteUserById);
router.get("/users", verifyAdmin, userController.findUsers);

//! Product
router.get("/products", productController.findProducts);
router.get("/product/:id", productController.findProductById);
router.post("/products", verifyUser, productController.createProduct);
router.patch("/product/:id", verifyUser, productController.updateProduct);
router.delete("/product/:id", verifyUser, productController.deleteProduct);

//! Category
router.get("/categories", categoryController.findCategories);
router.get("/category/:id", categoryController.findCategoryById);
router.post("/category", verifyUser, categoryController.createCategory);
router.patch("/category/:id", verifyAdmin, categoryController.updateCategory);
router.delete("/category/:id", verifyAdmin, categoryController.deleteCategory);

//! Transaction
router.post(
  "/transaction",
  verifyUser,
  transactionController.createTransaction
);
router.get(
  "/transactions",
  verifyAdmin,
  transactionController.findTransactions
);
router.get(
  "/transaction/:id",
  verifyUser,
  transactionController.findTransactionById
);
router.get(
  "/sales",
  verifyUser,
  transactionController.findTransactionSell
);
router.get(
  "/purchases",
  verifyUser,
  transactionController.findTransactionBuy
);

module.exports = router;
