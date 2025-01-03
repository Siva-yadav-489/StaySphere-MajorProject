const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const { saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
    .get(userController.renderSignUpForm) //SignUpForm
    .post(wrapAsync( userController.signUp));

 router.route("/login")
    .get(userController.renderLoginForm) //LoginForm
    .post(saveRedirectUrl, 
        passport.authenticate("local",
            {failureRedirect: "/login", failureFlash:true}
        ), userController.login)

router.get("/logout", userController.logout )

module.exports = router;