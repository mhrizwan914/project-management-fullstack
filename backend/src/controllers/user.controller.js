// Utils
import { async_handler } from "../utils/async_handler.js";

export const user_register = async_handler(async function (req, res) {
  console.log("Route handler called!");
  // Get data
  const { username, email, password } = req.body;
  // Validate data
});
