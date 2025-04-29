// Mongoose
import mongoose, { Schema } from "mongoose";

const sub_task_schema = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "task",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    is_completed: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
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

export const Sub_Task = mongoose.model("sub_task", sub_task_schema);
