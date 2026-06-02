// @ts-nocheck

import Budget from '../models/Budget.js';


// ================= GET BUDGET =================

export const getBudget = async (
  req,
  res
) => {

  try {

    const { month, year } =
      req.query;

    const budget =
      await Budget.findOne({
        user: (req as any).user._id,
        month: Number(month),
        year: Number(year),
      });

    res.status(200).json(
      budget
    );

  } catch (error) {

    console.error(
      'GET BUDGET ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server Error',
    });
  }
};


// ================= SAVE BUDGET =================

export const saveBudget = async (
  req,
  res
) => {

  try {

    console.log(
      'BODY:',
      req.body
    );

    console.log(
      'USER:',
      (req as any).user
    );

    const {
      month,
      year,
      monthlyBudget,
      categoryBudgets,
    } = req.body;

    const budget =
      await Budget.findOneAndUpdate(
        {
          user: (req as any).user._id,
          month,
          year,
        },
        {
          user: (req as any).user._id,
          month,
          year,
          monthlyBudget,
          categoryBudgets,
        },
        {
          new: true,
          upsert: true,
        }
      );

    res.status(200).json(
      budget
    );

  } catch (error) {

    console.error(
      'SAVE BUDGET ERROR:',
      error
    );

    res.status(500).json({
      message: 'Server Error',
    });
  }
};