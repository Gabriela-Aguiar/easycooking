const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const authController = require("../controllers/authController");

router.get("/login", authController.getLogin);

router.post("/signup", authController.getSignUp);

router.post("/login", authController.postLogin);

router.get("/home", ensureLogin.ensureLoggedIn(), authController.getHome);

router.get("/logout", authController.getLogout);

router.get("/resetPassword", authController.getResetPassword);

router.post("/resetPassword", authController.postResetPassword);

router.get("/about", authController.getAbout);

router.get("/resetpassword/:id", authController.getResetPasswordId);

router.post("/resetpassword/:id", authController.postResetPasswordId);

module.exports = router;
