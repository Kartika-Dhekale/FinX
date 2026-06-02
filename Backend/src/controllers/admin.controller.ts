import { Request, Response } from 'express';

import User from '../models/User.js';
import Expense from '../models/Expense.js';



// GET ALL USERS
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expenses = await Expense.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error: any) {
    console.error('EXPENSE ERROR:', error);

    res.status(500).json({
      message: 'Failed to fetch expenses',
      error: error.message,
    });
  }
};
// DELETE USER
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADMIN STATS =================

export const getAdminStats = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalExpenses =
      await Expense.countDocuments();

    const expenses =
      await Expense.find();

    const totalAmount =
      expenses.reduce(
        (acc: number, item: any) =>
          acc + item.amount,
        0
      );

    const currentMonth =
      new Date().getMonth();

    const currentYear =
      new Date().getFullYear();

    const monthlyExpenses =
      expenses.filter((exp: any) => {

        const date =
          new Date(exp.createdAt);

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      });

    const monthlyAmount =
      monthlyExpenses.reduce(
        (acc: number, item: any) =>
          acc + item.amount,
        0
      );

    res.json({
      totalUsers,
      totalExpenses,
      totalAmount,
      monthlyExpenses:
        monthlyAmount,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        'Admin stats failed',
    });
  }
};

// ================= TOP USERS =================

export const getTopUsers = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const topUsers =
      await Expense.aggregate([

        {
          $group: {

            _id: '$user',

            totalSpent: {
              $sum: '$amount',
            },

            expenseCount: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            totalSpent: -1,
          },
        },

        {
          $limit: 5,
        },

        {
          $lookup: {

            from: 'users',

            localField: '_id',

            foreignField: '_id',

            as: 'user',
          },
        },

        {
          $unwind: '$user',
        },

        {
          $project: {

            name:
              '$user.name',

            email:
              '$user.email',

            totalSpent: 1,

            expenseCount: 1,
          },
        },
      ]);

    res.json(topUsers);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        'Failed to load top users',
    });
  }
};

// ================= ACTIVITIES =================

export const getActivities = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const latestExpenses =
      await Expense.find()

        .sort({
          createdAt: -1,
        })

        .limit(10)

        .populate(
          'user',
          'name'
        );

    const activities =
      latestExpenses.map(
        (expense: any) => ({

          message: `${
            expense.user?.name ||
            'User'
          } added expense ₹${
            expense.amount
          }`,

          createdAt:
            expense.createdAt,
        })
      );

    res.json(activities);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        'Failed to load activities',
    });
  }
};

// ================= CATEGORY STATS =================

export const getCategoryStats =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const categories =
        await Expense.aggregate([

          {
            $group: {

              _id: '$category',

              total: {
                $sum: '$amount',
              },
            },
          },

          {
            $sort: {
              total: -1,
            },
          },
        ]);

      res.json(categories);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Category stats failed',
      });
    }
  };

// ================= USER GROWTH =================

export const getUserGrowth =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const totalUsers =
        await User.countDocuments();

      const dailyUsers =
        await User.countDocuments({

          createdAt: {

            $gte:
              new Date(
                Date.now() -
                  24 *
                    60 *
                    60 *
                    1000
              ),
          },
        });

      const weeklyUsers =
        await User.countDocuments({

          createdAt: {

            $gte:
              new Date(
                Date.now() -
                  7 *
                    24 *
                    60 *
                    60 *
                    1000
              ),
          },
        });

      const monthlyUsers =
        await User.countDocuments({

          createdAt: {

            $gte:
              new Date(
                Date.now() -
                  30 *
                    24 *
                    60 *
                    60 *
                    1000
              ),
          },
        });

      const monthlyGrowth =
        totalUsers > 0

          ? (
              (monthlyUsers /
                totalUsers) *
              100
            ).toFixed(1)

          : 0;

      res.json({

        totalUsers,

        dailyUsers,

        weeklyUsers,

        monthlyUsers,

        monthlyGrowth,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Growth analytics failed',
      });
    }
  };

// ================= FRAUD ALERTS =================

export const getFraudAlerts =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const suspiciousExpenses =
        await Expense.find({

          amount: {
            $gt: 50000,
          },
        })

          .sort({
            amount: -1,
          })

          .limit(5)

          .populate(
            'user',
            'name'
          );

      const alerts =
        suspiciousExpenses.map(
          (expense: any) => ({

            user:
              expense.user?.name ||
              'Unknown',

            amount:
              expense.amount,

            category:
              expense.category,

            createdAt:
              expense.createdAt,
          })
        );

      res.json(alerts);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          'Fraud alerts failed',
      });
    }
  };