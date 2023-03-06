const express = require("express");
const router = new express.Router();

const bookControllers = require("../controllers/booksController");
const countControllers = require("../controllers/countController");
const userControllers = require("../controllers/userController");
const loginControllers = require("../controllers/loginController");
const cpControllers = require("../controllers/changePasswordController");

// ==============================
router.post("/api/user", userControllers.user);
router.post("/api/otp", userControllers.otp);
router.post("/api/login", loginControllers.login);
router.post("/api/book", bookControllers.postBook);
router.get("/api/getBook", bookControllers.getBook);
router.get("/api/count", countControllers.count);
router.get("/api/getNewUser", userControllers.getNewUser);
router.post("/api/change-password", cpControllers.changePassword);
// -------------------------------

module.exports = router;
