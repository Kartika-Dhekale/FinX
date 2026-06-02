import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";

// @ts-ignore
import { SLR } from "ml-regression";

export const getPrediction = async (
  req: any,
  res: any
) => {
  try {

    const userId = req.user.id;

    const expenses = await Expense.find({
      user: userId,
    });

    const budget = await Budget.findOne({
      user: userId,
    });

    if (!expenses.length) {
      return res.json({
        currentSpend: 0,
        prediction: 0,
        monthlyData: {},
        message: "No expense data available",
      });
    }

    // =====================
    // Monthly + Category Totals
    // =====================

    const monthlyTotals: Record<
      string,
      number
    > = {};

    const categoryTotals: Record<
      string,
      number
    > = {};

    expenses.forEach((expense: any) => {

      const date = new Date(
        expense.date
      );

      const key =
        `${date.getFullYear()}-${
          date.getMonth() + 1
        }`;

      monthlyTotals[key] =
        (monthlyTotals[key] || 0) +
        expense.amount;

      categoryTotals[
        expense.category
      ] =
        (categoryTotals[
          expense.category
        ] || 0) +
        expense.amount;
    });

    // =====================
    // Sort Months
    // =====================

    const sortedMonths =
      Object.keys(monthlyTotals)
        .sort(
          (a, b) =>
            new Date(a).getTime() -
            new Date(b).getTime()
        );

    const totals =
      sortedMonths.map(
        month =>
          monthlyTotals[month]
      );

    const latestMonth =
      sortedMonths[
        sortedMonths.length - 1
      ];

    const currentSpend =
      monthlyTotals[latestMonth];

    const sortedMonthlyData =
      sortedMonths.reduce(
        (acc: any, month) => {

          acc[month] =
            monthlyTotals[month];

          return acc;

        },
        {}
      );

    // =====================
    // ML Prediction
    // =====================

    let prediction = null;

    if (totals.length >= 3) {

      const x =
        totals.map(
          (_, index) =>
            index + 1
        );

      const y = totals;

      const regression =
        new SLR(x, y);

      prediction =
        Math.round(
          regression.predict(
            totals.length + 1
          )
        );
    }

    // =====================
    // Budget Risk
    // =====================

    const monthlyBudget =
      budget?.monthlyBudget || 0;

    const risk =
      prediction !== null &&
      prediction > monthlyBudget;

    const overrun =
      risk
        ? prediction! -
          monthlyBudget
        : 0;

    // =====================
    // Improved Suggestions
    // =====================

    const suggestions: string[] =
      [];

    const highestCategory =
      Object.entries(
        categoryTotals
      ).sort(
        (a, b) =>
          b[1] - a[1]
      )[0];

    if (highestCategory) {

      suggestions.push(
        `${highestCategory[0]} is your highest expense category.`
      );

      suggestions.push(
        `Reduce ${highestCategory[0]} spending by 15% to improve savings.`
      );
    }

    if (
      currentSpend >
      monthlyBudget * 0.8
    ) {
      suggestions.push(
        "You have already used more than 80% of your budget."
      );
    }

    if (
      prediction &&
      prediction > monthlyBudget
    ) {
      suggestions.push(
        `At the current rate you may exceed your budget by ₹${overrun}.`
      );
    }

    if (
      suggestions.length === 0
    ) {
      suggestions.push(
        "Your spending habits look healthy."
      );
    }

    // =====================
    // Dashboard Analytics
    // =====================

    const monthlyChartData =
      sortedMonths.map(
        month => ({
          month,
          amount:
            monthlyTotals[month],
        })
      );

    const categoryChartData =
      Object.entries(
        categoryTotals
      ).map(
        ([category, amount]) => ({
          category,
          amount,
        })
      );

    // =====================
    // Savings Potential
    // =====================

    const savingsPotential =
      highestCategory
        ? Math.round(
            highestCategory[1] *
              0.15
          )
        : 0;

    // =====================
    // Response
    // =====================

    return res.json({

      currentSpend,

      prediction,

      monthlyBudget,

      risk,

      overrun,

      savingsPotential,

      suggestions,

      monthlyData:
        sortedMonthlyData,

      monthlyChartData,

      categoryChartData,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      message:
        "Prediction failed",

    });
  }
};