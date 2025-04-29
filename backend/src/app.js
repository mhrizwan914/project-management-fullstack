// Express
import express from "express";
// Cookie Parser
import cookieParser from "cookie-parser";
// Dotenv
import dotenv from "dotenv";
// Cors
import cors from "cors";

// Config dotenv
dotenv.config({
  path: "./.env",
});

// Create app
const app = express();

// Cors configurations
app.use(
  cors({
    origin: `http://localhost:8000`,
    methods: ["GET", "POST", "DELETE", "UPDATE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Middlewares
app.use(
  express.json({
    limit: "16kb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);
app.use(cookieParser());

// Export
export default app;
