const express = require("express");
const router = express.Router();
const { Auth } = require("../../Controllers/Index");
const validator = require("../../MiddleWare/validation");
const { userSchema, loginUserSchema, Signout, ChangePass } =
  require("../../MiddleWare/ValidationSchemas/Index").UserValidation;

// POST - Create user
router
  .route("/user")

  .post(validator(userSchema), Auth.SignUp)
  .get(Auth.User);

router.route("/login").post(validator(loginUserSchema), Auth.Login);

router.route("/signout").post(validator(Signout), Auth.SignOut);

router.route("/changePass").post(validator(ChangePass), Auth.ChangePass);

module.exports = router;
