const express  = require("express");
const router = express.Router();
const warpAsync  = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const { signupForm, signup, loginForm, login, logout } = require("../controllers/users.js");


router.route("/signup")
.get( signupForm)
.post(warpAsync(signup));

router.route("/login")
.get(loginForm)
.post(saveRedirectUrl,passport.authenticate("local", 
  {failureRedirect: "/login",failureFlash: true, }),login);


router.get("/logout",logout);

module.exports = router;