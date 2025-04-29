// Express router
import { Router } from "express";
// Controllers
import { health_check } from "../controllers/health_check.controller.js";

const router = Router();

router.route("/health-check").get(health_check);

export default router;
