import express from 'express';

import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expense.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getExpenses);

router.post('/', protect, addExpense);

router.put('/:id', protect, updateExpense);

router.delete('/:id', protect, deleteExpense);

export default router;