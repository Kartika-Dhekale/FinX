import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import { model } from "../services/gemini.service.js";

export const getInsights = async (
req: any,
res: any
) => {
try {
  
const userId = req.user.id;


const month =
  Number(req.query.month) ||
  new Date().getMonth() + 1;

const year =
  Number(req.query.year) ||
  new Date().getFullYear();

const startDate = new Date(
  year,
  month - 1,
  1
);

const endDate = new Date(
  year,
  month,
  1
);

const expenses = await Expense.find({
  user: userId,
  date: {
    $gte: startDate,
    $lt: endDate,
  },
});

const budget =
  await Budget.findOne({
    user: userId,
  });

const totalSpent =
  expenses.reduce(
    (
      sum: number,
      expense: any
    ) =>
      sum +
      expense.amount,
    0
  );

const monthlyBudget =
  budget?.monthlyBudget || 0;

const savings =
  monthlyBudget - totalSpent;

const categoryTotals: Record<
  string,
  number
> = {};

expenses.forEach(
  (expense: any) => {
    categoryTotals[
      expense.category
    ] =
      (categoryTotals[
        expense.category
      ] || 0) +
      expense.amount;
  }
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

const highestCategory =
  Object.entries(
    categoryTotals
  ).sort(
    (
      a: any,
      b: any
    ) =>
      b[1] - a[1]
  )[0];

const riskLevel =
  totalSpent >
  monthlyBudget
    ? "HIGH"
    : totalSpent >
      monthlyBudget *
        0.8
    ? "MEDIUM"
    : "LOW";
const recommendations: string[] = [];

if (highestCategory) {
  recommendations.push(
    `${highestCategory[0]} is your highest spending category.`
  );
}

if (savings > 0) {
  recommendations.push(
    `You saved ₹${savings} this month.`
  );
}

if (totalSpent > monthlyBudget * 0.8) {
  recommendations.push(
    "You have already used more than 80% of your budget."
  );
}

if (totalSpent > monthlyBudget) {
  recommendations.push(
    "You have exceeded your budget."
  );
}

const financialScore =
  Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (monthlyBudget > 0
          ? (1 -
              totalSpent /
                monthlyBudget) *
              100
          : 50) + 50
      )
    )
  );

let aiText =
  "Keep monitoring your spending.";

try {
const prompt = `
Monthly Budget: ₹${monthlyBudget}

Total Spent: ₹${totalSpent}

Savings: ₹${savings}

Category Breakdown:
${JSON.stringify(
  categoryTotals,
  null,
  2
)}

Give:
1. Spending analysis
2. Saving recommendation
3. Budget advice

Keep under 100 words.
`;


  const result =
    await model.generateContent(
      prompt
    );

  aiText =
    result.response.text();
} catch (
  geminiError
) {
  console.log(
    "Gemini Error:",
    geminiError
  );
}
const aiInsights = [];

if (highestCategory) {
  aiInsights.push({
    title: "Largest Spending Area",
    description: `${highestCategory[0]} accounts for ${(
      (highestCategory[1] / totalSpent) *
      100
    ).toFixed(1)}% of your monthly spending. This category has the biggest impact on your budget.`,
  });
}

if (savings > 0) {
  aiInsights.push({
    title: "Savings Performance",
    description: `You are on track with your budget and have saved ₹${savings} this month.`,
  });
}

if (totalSpent > monthlyBudget * 0.8) {
  aiInsights.push({
    title: "Budget Alert",
    description: `You have already used ${(
      (totalSpent / monthlyBudget) *
      100
    ).toFixed(0)}% of your monthly budget.`,
  });
}

if (monthlyBudget > 0) {
  aiInsights.push({
    title: "Savings Opportunity",
    description: `Reducing ${highestCategory?.[0] || "your top category"} spending by 15% could increase your monthly savings.`,
  });
}
const topCategory =
  categoryChartData.length > 0
    ? categoryChartData.sort(
        (a, b) => b.amount - a.amount
      )[0]
    : null;

const budgetUsage =
  monthlyBudget > 0
    ? (
        (totalSpent /
          monthlyBudget) *
        100
      ).toFixed(1)
    : 0;

let trend = "Stable";

if (
  Number(budgetUsage) > 90
)
  trend = "High Spending";

if (
  Number(budgetUsage) < 50
)
  trend = "Controlled Spending";

const riskPrediction =
  totalSpent >
  monthlyBudget * 0.9
    ? "High risk of exceeding budget"
    : totalSpent >
      monthlyBudget * 0.7
    ? "Monitor spending carefully"
    : "Budget looks healthy";
return res.json({
  summary: {
    totalSpent,
    monthlyBudget,
    savings,
  },
  

  financialScore,
  
  categoryChartData,

  analytics: {
    budgetUsage,
    trend,
    riskPrediction,
    topCategory,
  },
  riskAnalysis: {
    budget:
      monthlyBudget,

    totalSpent,

    riskLevel,
  },
  

  behaviour: {
    focusCategory:
      highestCategory?.[0] ||
      "None",

    budgetDiscipline:
      totalSpent <=
      monthlyBudget
        ? "Good"
        : "Poor",
  },

  

  
 aiInsights,
});

} catch (error) {
console.log(
"Insights Error:",
error
);


return res
  .status(500)
  .json({
    message:
      "Failed to load insights",
  });


}
};
