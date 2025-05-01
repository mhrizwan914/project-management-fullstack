// Mongoose
import mongoose, { Schema } from "mongoose";
// Constaints
import { user_role_enums } from "../utils/constaints.js";
// Bcryptjs
import bcrypt from "bcryptjs";
// JWT
import jwt from "jsonwebtoken";
// Node
import crypto from "crypto";

const user_schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: {
        url: String,
        local_path: String,
      },
      default: {
        url: "https://placehold.co/600x400/orange/white",
        local_path: null,
      },
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: user_role_enums,
      default: user_role_enums[2],
    },
    refresh_token: String,
    email_verification_token: String,
    email_verification_token_expiry: Date,
    password_reset_token: String,
    password_reset_token_expiry: Date,
  },
  {
    timestamps: true,
  },
);

// Hooks
user_schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Custom Methods
user_schema.methods.verify_password = async function (password) {
  return await bcrypt.compare(password, this.password);
};

user_schema.methods.generate_access_token = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY },
  );
};

user_schema.methods.generate_refresh_token = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY },
  );
};

user_schema.methods.generate_temporary_token = function () {
  const un_hash_token = crypto.randomBytes(20).toString("hex");
  const hash_token = crypto.createHash("sha256").update(un_hash_token).digest("hex");
  const token_expiry = Date.now() + 20 * 60 * 1000;
  return {
    un_hash_token,
    hash_token,
    token_expiry,
  };
};

export const User = mongoose.model("user", user_schema);
