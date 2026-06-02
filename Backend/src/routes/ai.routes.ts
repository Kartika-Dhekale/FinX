import express from "express";
import { getInsights } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/insights", protect, getInsights);

export default router;