// Mongoose
import mongoose, { Schema } from "mongoose";
// Constaints
import { user_role_enums } from "../utils/constaints.js";

const project_member_schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    role: {
      type: String,
      enum: user_role_enums,
      default: user_role_enums[2],
    },
  },
  {
    timestamps: true,
  },
);

export const Project_Member = mongoose.model("project_member", project_member_schema);
