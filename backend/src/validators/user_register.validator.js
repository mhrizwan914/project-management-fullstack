// Express Validator
import { body } from "express-validator";

export default function user_register_validator() {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is rquired")
      .isLength({ min: 3 })
      .withMessage("Username should be at least 3 characters")
      .isLength({ max: 10 })
      .withMessage("Username should not exceed 10 characters"),
    body("email")
      .isEmail()
      .withMessage("Email must be valid")
      .trim()
      .notEmpty()
      .withMessage("Email is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is rquired")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters"),
  ];
}
