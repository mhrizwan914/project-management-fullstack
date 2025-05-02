// Express router
import { Router } from "express";
// Controllers
import {
  user_login,
  user_profile,
  user_logout,
  user_change_password,
  user_verify,
  user_email_verify,
} from "../controllers/auth.controller.js";
// Validators schema's
import { user_login_validator, user_password_validator } from "../validators/index.js";
// Middleware
import validator_middleware from "../middlewares/validator.middleware.js";
import auth_middleware from "../middlewares/auth.middleware.js";

const router = Router();

// Register
router.route("/login").post(user_login_validator(), validator_middleware, user_login);

// Profile
router.route("/profile").get(auth_middleware, user_profile);

// Logout
router.route("/logout").get(auth_middleware, user_logout);

// Change Password
router
  .route("/change-password")
  .post(user_password_validator(), validator_middleware, auth_middleware, user_change_password);

// Email Verification
router.route("/email-verify").get(auth_middleware, user_email_verify);

// Verify
router.route("/verify/:token").get(auth_middleware, user_verify);

export default router;
