
import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createLog } from '../utils/logger.js';

export const register = async (req: Request, res: Response) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // 🔥 ADD LOG HERE (IMPORTANT)
   await createLog(
  `New user registered: ${user.email}`,
  user._id.toString(),
  "info"
);

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // ✅ ADD LOG HERE (IMPORTANT)
    await createLog(
      `User logged in: ${user.email}`,
      user._id.toString(),
      'info'
    );

    res.json({
      token,
      user,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    // optional error log
    await createLog(
      `Login error occurred for email: ${req.body.email}`,
      null,
      'error'
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};
