// Mongoose
import mongoose, { Schema } from "mongoose";

const project_note_schema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Project_Note = mongoose.model("project_note", project_note_schema);
