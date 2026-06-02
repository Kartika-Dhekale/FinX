import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import budgetRoutes from './routes/budget.routes.js';


import adminRoutes
from './routes/admin.routes.js';
dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // your frontend
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use(
  '/api/admin',
  adminRoutes
);
app.use('/api/budgets', budgetRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);


export default app;
