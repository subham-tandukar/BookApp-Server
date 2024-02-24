const express = require("express");
const router = new express.Router();

const bookControllers = require("../controllers/booksController");
const countControllers = require("../controllers/countController");
const userControllers = require("../controllers/userController");
const otpControllers = require("../controllers/otpController");
const loginControllers = require("../controllers/loginController");
const cpControllers = require("../controllers/changePasswordController");
const genreControllers = require("../controllers/genreController");

// ==============================
router.post("/api/user", userControllers.user);
router.post("/api/appUser", userControllers.appUser);
router.post("/api/otp", otpControllers.otp);
router.post("/api/resendOtp", otpControllers.resendOtp);
router.post("/api/login", loginControllers.login);
router.post("/api/appLogin", loginControllers.appLogin);
router.post("/api/book", bookControllers.postBook);
router.get("/api/getBook", bookControllers.getBook);
router.get("/api/count", countControllers.count);
router.get("/api/getNewUser", userControllers.getNewUser);
router.get("/api/getUser", userControllers.getUser);
router.post("/api/change-password", cpControllers.changePassword);
router.post("/api/forget-password", cpControllers.forgetPassword);
router.post("/api/genre", genreControllers.genre);
// -------------------------------

module.exports = router;
