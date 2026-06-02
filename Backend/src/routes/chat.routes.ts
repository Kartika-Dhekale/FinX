import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { chatAssistant } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", protect, chatAssistant);

export default router;