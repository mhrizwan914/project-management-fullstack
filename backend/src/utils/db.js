// Mongoose
import mongoose from "mongoose";
// Constaints
import { DB_NAME } from "./constaints.js";

export default async function db_handler() {
  try {
    const db = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
    return db?.connection;
  } catch (error) {
    throw error?.message;
  }
}
