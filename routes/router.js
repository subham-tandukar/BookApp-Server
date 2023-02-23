const express = require("express");
const router = new express.Router();
const User = require("../models/userSchema");

const bookControllers = require("../controllers/booksController");
const countControllers = require("../controllers/countController");
const userControllers = require("../controllers/userController");
const loginControllers = require("../controllers/loginController");
const cpControllers = require("../controllers/changePasswordController");

// ==========
router.post("/api/book", bookControllers.bookpost);
router.get("/api/count", countControllers.count);
router.post("/api/addUser", userControllers.postUser);
router.get("/api/getUserData", userControllers.getUser);
router.post("/api/login", loginControllers.login);
router.post("/api/change-password", cpControllers.changePassword);
// -------------------------------

module.exports = router;
