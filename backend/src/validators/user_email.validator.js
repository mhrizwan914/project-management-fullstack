// Express Validator
import { body } from "express-validator";

export default function user_email_validator() {
  return [
    body("email")
      .isEmail()
      .withMessage("Email must be valid")
      .trim()
      .notEmpty()
      .withMessage("Email is required"),
  ];
}
