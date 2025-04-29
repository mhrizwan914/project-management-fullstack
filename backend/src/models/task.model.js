// Mongoose
import mongoose, { Schema } from "mongoose";
// Constaints
import { task_status_enums } from "../utils/constaints.js";

const task_schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    assign_to: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    assign_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: task_status_enums,
      default: task_status_enums[0],
    },
    attachments: {
      type: [
        {
          url: String,
          mimetype: String,
          size: Number,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model("task", task_schema);
