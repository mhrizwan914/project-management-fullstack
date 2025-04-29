// Express Validator
import { body } from "express-validator";

export default function user_login_validator() {
  return [
    body("email")
      .isEmail()
      .withMessage("Email must be valid")
      .trim()
      .notEmpty()
      .withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is rquired").trim(),
  ];
}
