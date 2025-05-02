// Express router
import { Router } from "express";
// Controllers
import {
  user_forgot_password,
  user_register,
  user_verify,
  user_reset_password,
  user_access_token,
} from "../controllers/user.controller.js";
// Validators schema's
import {
  user_register_validator,
  user_email_validator,
  user_password_validator,
} from "../validators/index.js";
// Middleware
import validator_middleware from "../middlewares/validator.middleware.js";

const router = Router();

// Register
router.route("/register").post(user_register_validator(), validator_middleware, user_register);

// Verify
router.route("/verify/:token").get(user_verify);

// Forgot password
router
  .route("/forgot-password")
  .get(user_email_validator(), validator_middleware, user_forgot_password);

// Forgot password
router
  .route("/reset-password/:token")
  .get(user_password_validator(), validator_middleware, user_reset_password);

// Access Token
router.route("/access-token").get(user_access_token);

export default router;
