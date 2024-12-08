const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router
    .route("/signup")
    //  routes for signup
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.createUser))

router
    .route("/login")
    // routes for login
    .get(userController.renderLoginForm)
    // here passport.authenticate checks wather the user is already present in the database or not if exists ok else redirct to loginpage
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login",failureFlash:true}),wrapAsync(userController.loginUser))

router.get("/logout",userController.logoutUser)

module.exports = router;