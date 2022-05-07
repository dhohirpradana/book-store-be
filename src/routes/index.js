const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const bookController = require("../controllers/book.js");
const categoryController = require("../controllers/category");
const transactionController = require("../controllers/transaction");
const rajaOngkirController = require("../controllers/rajaongkir");
const provinceController = require("../controllers/province");
const cityController = require("../controllers/city");
const subDistrictController = require("../controllers/subdistrict");
const addressController = require("../controllers/address");
const cartController = require("../controllers/cart");
const { verifyAdmin, verifyUser } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

//! User
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", verifyUser, userController.me);
router.get("/user/:id", verifyUser, userController.findUserById);
router.patch("/user", verifyUser, userController.updateUser);
router.delete("/user/:id", verifyAdmin, userController.deleteUser);
router.get("/users", userController.findUsers);

//! Book
router.get("/books", bookController.findBooks);
router.get("/book/:id", bookController.findBookById);
router.post(
  "/book",
  verifyUser,
  uploadFile("image"),
  bookController.createBook
);
router.patch(
  "/book/:id",
  verifyUser,
  uploadFile("image"),
  bookController.updateBook
);
router.delete("/book/:id", verifyUser, bookController.deleteBook);

//! Category
router.get("/categories", categoryController.findCategories);
router.get("/category/:id", categoryController.findCategoryById);
router.post("/category", verifyUser, categoryController.createCategory);
router.patch("/category/:id", verifyAdmin, categoryController.updateCategory);
router.delete("/category/:id", verifyAdmin, categoryController.deleteCategory);

//! Address
router.get("/address", verifyUser, addressController.findAddressesByUser);
router.post("/address", verifyUser, addressController.createAddress);
router.get("/address/:id", verifyUser, addressController.findAddressById);
router.delete("/address/:id", verifyUser, addressController.deleteAddress);

//! Raja Ongkir
router.get("/cost/:courier", rajaOngkirController.getCost);

//! Province & city & subdistricts
router.get("/provinces", provinceController.findProvinces);
router.get("/province/:provinceId/cities", cityController.findCities);
router.get(
  "/city/:cityId/subdistricts",
  subDistrictController.findSubdistricts
);

//! Cart
router.get("/carts", verifyUser, cartController.findCartByUser);
router.post("/cart", verifyUser, cartController.createCart);

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
