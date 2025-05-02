// Utils
import {
  async_handler,
  api_response,
  send_mail,
  generate_email_verification_body,
  api_error,
} from "../utils/index.js";
// Model
import { User } from "../models/user.model.js";
// Node
import crypto from "crypto";

// Login
export const user_login = async_handler(async (req, res) => {
  // Get data
  const { email, password } = req.body;
  /* 
    @ Validate data 
    @ We are using express validtor middleware
  */
  // Check existing user
  const is_user = await User.findOne({ email });
  if (!is_user) {
    throw new api_error(403, "User is not exsist");
  }
  // Check password
  const check_password = await is_user.verify_password(password);
  if (!check_password) {
    throw new api_error(403, "Email or Password not correct");
  }
  // Generate Access and Refresh Tokens
  const access_token = is_user.generate_access_token();
  const refresh_token = is_user.generate_refresh_token();
  // Set access token to cookies
  const cookie_option_access = {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 60 * 1000,
  };
  const cookie_option_refresh = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
  res.cookie("access_token", access_token, cookie_option_access);
  res.cookie("refresh_token", refresh_token, cookie_option_refresh);
  // Store refresh token to db
  is_user.refresh_token = refresh_token;
  await is_user.save();
  // Send response
  return res.status(200).json(
    new api_response(
      200,
      {
        user: {
          username: is_user.username,
          email: is_user.email,
          role: is_user.role,
          is_verified: is_user.is_verified,
          access_token: is_user.access_token,
        },
      },
      "User login successfully",
    ),
  );
});

// Profile
export const user_profile = async_handler(async (req, res) => {
  // Get data
  const { user } = req;
  // Find data
  const is_user = await User.findOne({ email: user.email });
  if (!is_user) {
    throw new api_error(401, "Unauthorized: User no longer exists.");
  }
  // Send data
  return res.status(200).json(
    new api_response(
      200,
      {
        user: {
          username: is_user.username,
          email: is_user.email,
          role: is_user.role,
          is_verified: is_user.is_verified,
          refresh_token: is_user.refresh_token,
          avatar: is_user.avatar,
        },
      },
      "User is authentic",
    ),
  );
});

// Logout
export const user_logout = async_handler(async (req, res) => {
  // Get data
  const { user } = req;
  // Find data
  const is_user = await User.findOne({ email: user.email });
  if (!is_user) {
    throw new api_error(401, "Unauthorized: User no longer exists.");
  }
  // Remove refresh token
  is_user.refresh_token = undefined;
  await is_user.save();
  // Clear cookies
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.status(200).json(new api_response(200, {}, "User logout successfully"));
});

// Change Password
export const user_change_password = async_handler(async (req, res) => {
  // Get data
  const { password } = req.body;
  const { user } = req;
  // Find data
  const is_user = await User.findById(user._id);
  if (!is_user) {
    throw new api_error(401, "Unauthorized: User no longer exists.");
  }
  // Save password
  is_user.password = password;
  await is_user.save();
  // Send response
  return res.status(200).json(new api_response(200, {}, "Change password successfully"));
});

// Email verification
export const user_email_verify = async_handler(async function (req, res) {
  // Get data
  const { user } = req;
  /* 
    @ Validate data 
    @ We are using express validtor middleware
  */
  // Check existing user
  const is_user = await User.findOne({ email: user.email });
  if (!is_user) {
    throw new api_error(403, "User is not exsist");
  }
  // Create email verification token
  const token = is_user.generate_temporary_token();
  // Save email verification token and expiry
  is_user.email_verification_token = token.hash_token;
  is_user.email_verification_token_expiry = token.token_expiry;
  await is_user.save();
  // Send verification email
  try {
    await send_mail({
      email: is_user.email,
      subject: "Verification Email",
      body: generate_email_verification_body(
        is_user.username,
        `http://localhost:8000/api/v1/auth/verify/${token.un_hash_token}`,
      ),
    });
    return res.status(200).json(new api_response(200, {}, "Verification email is sent"));
  } catch (error) {
    throw new api_error(500, error.message);
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
