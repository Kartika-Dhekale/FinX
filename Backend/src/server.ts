import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import adminRoutes from './routes/admin.routes.js';
import aiRoutes from "./routes/ai.routes.js";
import predictionRoutes
from "./routes/prediction.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use("/api/ai", aiRoutes);
app.use(
  "/api/predictions",
  predictionRoutes
);
app.use("/api/chat", chatRoutes);



const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB Connected');
    console.log(
  "GEMINI KEY:",
  process.env.GEMINI_API_KEY
);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });