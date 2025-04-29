// App
import app from "./app.js";
// Database
import db_handler from "./utils/db.js";
// All routes
import health_check from "./routes/health_check.route.js";
import user from "./routes/user.route.js";

// Assign port
const port = process.env.PORT || 8000;

// All routes
app.use("/api/v1", health_check);
app.use("/api/v1/user", user);

// Callig database and start server
try {
  const db = await db_handler();
  console.log("Database is connected", `HOST: ${db.host}`, `NAME: ${db.name}`);
  app.listen(port, function () {
    console.log(`Server is running port: ${port} 😊`);
  });
} catch (error) {
  console.error("Database not connected 🤢", `Error: ${error}`);
  process.exit(1);
}
