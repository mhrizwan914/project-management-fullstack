// Mongoose
import mongoose, { Schema } from "mongoose";

const project_schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Project = mongoose.model("project", project_schema);
