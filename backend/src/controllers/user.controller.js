// Utils
import {
  async_handler,
  api_response,
  send_mail,
  generate_email_verification_body,
  generate_forgot_password_body,
  api_error,
} from "../utils/index.js";
// Model
import { User } from "../models/user.model.js";
// Node
import crypto from "crypto";

// Register
export const user_register = async_handler(async function (req, res) {
  // Get data
  const { username, email, password } = req.body;
  /* 
    @ Validate data 
    @ We are using express validtor middleware
  */
  // Check existing user
  const is_user = await User.findOne({ email });
  if (is_user) {
    res.status(409).json(new api_response(409, {}, "User might be exist"));
  }
  // Create user
  const user = await User.create({
    username,
    email,
    password,
  });
  // Create email verification token
  const token = user.generate_temporary_token();
  // Save email verification token and expiry
  user.email_verification_token = token.hash_token;
  user.email_verification_token_expiry = token.token_expiry;
  await user.save();
  // Send verification email
  try {
    await send_mail({
      email: user.email,
      subject: "Verification Email",
      body: generate_email_verification_body(
        user.username,
        `http://localhost:8000/api/v1/user/verify/${token.un_hash_token}`,
      ),
    });
    return res.status(201).json(new api_response(201, {}, "User registered successfully"));
  } catch (error) {
    throw new api_error(500, `${error?.message}`, error);
  }
});
// Verify
export const user_verify = async_handler(async function (req, res) {
  // Get token
  const { token } = req.params;
  // Unhash token
  const hash_token = crypto.createHash("sha256").update(token).digest("hex");
  // Find token
  const user = await User.findOne({
    email_verification_token: hash_token,
    email_verification_token_expiry: { $gt: new Date(Date.now()) },
  });
  if (!user) {
    throw new api_error(401, "Verfication token might be expired");
  }
  // Verify user
  user.is_verified = true;
  user.email_verification_token = undefined;
  user.email_verification_token_expiry = undefined;
  await user.save();
  // Send response
  return res.status(200).json(new api_response(200, {}, "User email verified successfully"));
});
// Forgot password
export const user_forgot_password = async_handler(async function (req, res) {
  // Get email
  const { email } = req.body;
  /* 
    @ Validate data 
    @ We are using express validtor middleware
  */
  // Find email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json(new api_response(401, {}, "Email or User not found"));
  }
  // Generate token
  const token = user.generate_temporary_token();
  // Save token and expiry
  user.password_reset_token = token.hash_token;
  user.password_reset_token_expiry = token.token_expiry;
  // Send token via email
  await user.save();
  // Send verification email
  send_mail({
    email: user.email,
    subject: "Forgot Password Email",
    body: generate_forgot_password_body(
      user.username,
      `http://localhost:8000/api/v1/user/reset-password/${token.un_hash_token}`,
    ),
  })
    .then(() => {
      return res
        .status(200)
        .json(new api_response(200, {}, "Forgot password email sent successfully"));
    })
    .catch((error) => {
      return res
        .status(500)
        .json(new api_error(500, `Forgot password email did not send ${error}`, error));
    });
});
// Reset password
export const user_reset_password = async_handler(async function (req, res) {
  // Get token
  const { token } = req.params;
  const { password } = req.body;
  // Unhash token
  const hash_token = crypto.createHash("sha256").update(token).digest("hex");
  // Find token
  const user = await User.findOne({
    password_reset_token: hash_token,
    password_reset_token_expiry: { $gt: new Date(Date.now()) },
  });
  if (!user) {
    throw new api_error(401, "Reset token might be expired");
  }
  // Verify user
  user.password = password;
  user.password_reset_token = undefined;
  user.password_reset_token_expiry = undefined;
  await user.save();
  // Send response
  return res.status(200).json(new api_response(200, {}, "Reset password successfully"));
});
