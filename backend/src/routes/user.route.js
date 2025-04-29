// Express router
import { Router } from "express";
// Controllers
import { user_register } from "../controllers/user.controller.js";
// Register user valid schema
import user_register_validator from "../validators/user_register.validator.js";
// Middleware
import { validator } from "../middlewares/validator.middleware.js";

const router = Router();

// Register
router.route("/register").post(user_register_validator(), validator, user_register);

export default router;
