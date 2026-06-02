import express from "express";

import {
  getPrediction
}
from "../controllers/prediction.controller.js";

import {
  protect
}
from "../middleware/auth.middleware.js";

const router =
  express.Router();

router.get(
  "/",
  protect,
  getPrediction
);

export default router;