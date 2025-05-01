// Mongoose
import mongoose from "mongoose";
// Utilss
import { api_error } from "../utils/index.js";

export default function error_middleware(err, req, res, next) {
  let error = err;

  if (!(error instanceof api_error)) {
    const status_code = error?.statusCode || error instanceof mongoose.Error ? 400 : 500;
    const message = error?.message || "Somthing went wrong";
    error = new api_error(status_code, message, error?.error || [], error?.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error?.stack } : {}),
  };

  return res.status(error?.status_code).json(response);
}
