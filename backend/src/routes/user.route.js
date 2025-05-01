// Express router
import { Router } from "express";
// Controllers
import {
  user_forgot_password,
  user_register,
  user_verify,
  user_reset_password,
} from "../controllers/user.controller.js";
// Validators schema's
import {
  user_register_validator,
  user_forgot_password_validator,
  user_reset_password_validator,
} from "../validators/index.js";
// Middleware
import { validator } from "../middlewares/validator.middleware.js";

const router = Router();

// Register
router.route("/register").post(user_register_validator(), validator, user_register);

// Verify
router.route("/verify/:token").get(user_verify);

// Forgot password
router
  .route("/forgot-password")
  .get(user_forgot_password_validator(), validator, user_forgot_password);

// Forgot password
router
  .route("/reset-password/:token")
  .get(user_reset_password_validator(), validator, user_reset_password);

export default router;
