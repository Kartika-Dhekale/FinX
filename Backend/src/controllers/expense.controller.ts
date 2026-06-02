import { Request, Response } from 'express';
import Expense from '../models/Expense.js';
import Activity from '../models/Activity.js';

// ================= GET EXPENSES =================
export const getExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Unauthorized',
      });

      return;
    }
     await Activity.create({
  message: 'Expense added successfully',
  type: 'expense',
});
await Activity.create({
  message: 'New user registered',
  type: 'user',
});
    const expenses = await Expense.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(
      'GET EXPENSES ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server Error',
    });
  }
};

// ================= ADD EXPENSE =================
export const addExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Unauthorized',
      });

      return;
    }

    const {
      title,
      amount,
      category,
      date,
    } = req.body;

    if (
      !title ||
      !amount ||
      !category
    ) {
      res.status(400).json({
        message:
          'Please fill all fields',
      });

      return;
    }

    const expense = await Expense.create({
      user: req.user.id,

      title,

      amount: Number(amount),

      category,

      date: date || new Date(),
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(
      'ADD EXPENSE ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server Error',
    });
  }
};

// ================= UPDATE EXPENSE =================
export const updateExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Unauthorized',
      });

      return;
    }

    const expense = await Expense.findById(
      req.params.id
    );

    if (!expense) {
      res.status(404).json({
        message:
          'Expense not found',
      });

      return;
    }

    if (
      expense.user.toString() !==
      req.user.id.toString()
    ) {
      res.status(401).json({
        message: 'Unauthorized',
      });

      return;
    }

    const updatedExpense =
      await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json(
      updatedExpense
    );
  } catch (error) {
    console.error(
      'UPDATE EXPENSE ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server Error',
    });
  }
};

// ================= DELETE EXPENSE =================
export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Unauthorized',
      });

      return;
    }

    const expense = await Expense.findById(
      req.params.id
    );

    if (!expense) {
      res.status(404).json({
        message:
          'Expense not found',
      });

      return;
    }

    if (
      expense.user.toString() !==
      req.user.id.toString()
    ) {
      res.status(401).json({
        message: 'Unauthorized',
      });

      return;
    }

    await expense.deleteOne();

    res.status(200).json({
      message:
        'Expense deleted successfully',
    });
  } catch (error) {
    console.error(
      'DELETE EXPENSE ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server Error',
    });
  }
};