// Express Validator
import { validationResult } from "express-validator";
// Utils
import { api_error } from "../utils/index.js";

export default function validator_middleware(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extract_erros = [];

  errors.array().forEach((error) => {
    extract_erros.push({
      [error.path]: [error.msg],
    });
  });

  throw new api_error(403, "Requested data is not valid", extract_erros);
}
