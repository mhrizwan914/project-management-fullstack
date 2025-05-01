// Class
import api_response from "../utils/api_response.js";

export function health_check(req, res) {
  res.status(200).json(new api_response(200, {}, "Serer is running"));
}
