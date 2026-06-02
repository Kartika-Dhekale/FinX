import dotenv from "dotenv";

dotenv.config();
import { GoogleGenerativeAI }
from "@google/generative-ai";

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );
  console.log(
  "KEY EXISTS:",
  !!process.env.GEMINI_API_KEY
);

export const model =
  genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });