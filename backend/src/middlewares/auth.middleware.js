// Utils
import { api_error } from "../utils/index.js";
// JWT
import jwt from "jsonwebtoken";

export default function auth_middleware(req, res, next) {
  const access_token = req?.cookies?.access_token;
  if (!access_token) {
    throw new api_error(401, "Access token is required");
  }
  jwt.verify(access_token, process.env.JWT_ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      throw new api_error(401, err.message);
    }
    req.user = decoded;
    next();
  });
}
