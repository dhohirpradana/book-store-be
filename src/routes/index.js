const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const productController = require("../controllers/product");
const categoryController = require("../controllers/category");
const transactionController = require("../controllers/transaction");
const rajaOngkirController = require("../controllers/rajaongkir");
const addressController = require("../controllers/address");
const { verifyAdmin, verifyUser } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

//! User
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", verifyUser, userController.me);
router.get("/user/:id", verifyUser, userController.findUserById);
router.patch("/user", verifyUser, userController.updateUser);
router.delete("/user/:id", verifyAdmin, userController.deleteUser);
router.get("/users", verifyAdmin, userController.findUsers);

//! Product
router.get("/products", productController.findProducts);
router.get("/product/:id", productController.findProductById);
router.post(
  "/product",
  verifyUser,
  uploadFile("image"),
  productController.createProduct
);
router.patch(
  "/product/:id",
  verifyUser,
  uploadFile("image"),
  productController.updateProduct
);
router.delete("/product/:id", verifyUser, productController.deleteProduct);

//! Category
router.get("/categories", categoryController.findCategories);
router.get("/category/:id", categoryController.findCategoryById);
router.post("/category", verifyUser, categoryController.createCategory);
router.patch("/category/:id", verifyAdmin, categoryController.updateCategory);
router.delete("/category/:id", verifyAdmin, categoryController.deleteCategory);

//! Address
router.get("/addresses", verifyUser, addressController.findAddressesByUser);
router.get(
  "/shipping-address",
  verifyUser,
  addressController.findShippingAddressesByUser
);
router.post("/address", verifyUser, addressController.createAddress);
router.get("/address/:id", verifyUser, addressController.findAddressById);
router.delete("/address/:id", verifyUser, addressController.deleteAddress);

//! Raja Ongkir
router.get("/province", rajaOngkirController.getProvince);
router.get("/city/:province", rajaOngkirController.getAllCityInProvince);
router.get("/cost/:courier", rajaOngkirController.getCost);

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
router.get("/sales", verifyUser, transactionController.findTransactionSell);
router.get("/purchases", verifyUser, transactionController.findTransactionBuy);
router.post("/notification", transactionController.notification);

module.exports = router;
