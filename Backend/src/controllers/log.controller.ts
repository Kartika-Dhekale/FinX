import { Request, Response } from "express";
import Log from "../models/log.model.js";

export const getLogs = async (req: Request, res: Response) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(200);

    res.status(200).json(logs);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch logs",
      error: error.message,
    });
  }
};

// helper function
export const createLog = async (
  message: string,
  userId: string | null = null,
  level: "info" | "warning" | "error" = "info"
) => {
  try {
    await Log.create({
      message,
      user: userId,
      level,
    });
  } catch (error) {
    console.error("LOG ERROR:", error);
  }
};