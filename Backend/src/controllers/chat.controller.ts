import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import { model } from "../services/gemini.service.js";

export const chatAssistant = async (req: any, res: any) => {
  try {
    console.log("🔥 CHAT API HIT");

    const userId = req.user.id;
    const { message, month, year } = req.body;

    // ---------------- MONTH ----------------
    const selectedMonth = Number(month) || new Date().getMonth() + 1;
    const selectedYear = Number(year) || new Date().getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 1);

    // ---------------- DATA ----------------
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
    });

    const budget = await Budget.findOne({ user: userId });

    const totalSpent = expenses.reduce(
      (sum: number, e: any) => sum + (e.amount || 0),
      0
    );

    // ---------------- CATEGORY ANALYSIS ----------------
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((e: any) => {
      const cat = (e.category || "other").trim().toLowerCase();
      categoryTotals[cat] =
        (categoryTotals[cat] || 0) + (e.amount || 0);
    });

    const sorted = Object.entries(categoryTotals).sort(
      (a: any, b: any) => (b[1] as number) - (a[1] as number)
    );

    const topCategory = sorted[0] || ["other", 0];

    const budgetAmount = budget?.monthlyBudget || 0;
    const remaining = budgetAmount - totalSpent;

    const msg = (message || "").toLowerCase();

    let reply = "";

    // ---------------- INTENT DETECTION (FIXED) ----------------
// ---------------- INTENT DETECTION ----------------

const isTopSpend =
  msg.includes("top spending category") ||
  msg.includes("highest spending") ||
  msg.includes("most spending") ||
  msg.includes("where did i spend") ||
  msg.includes("wasting money") ||
  msg.includes("waste");

const isBreakdown =
  msg.includes("break down") ||
  msg.includes("breakdown") ||
  msg.includes("expenses by category");

const isComparison =
  msg.includes("compare") ||
  msg.includes("pattern") ||
  msg.includes("trend");

const isSaving =
  msg.includes("save") ||
  msg.includes("reduce my expenses") ||
  msg.includes("saving tips") ||
  msg.includes("suggest 3 ways");

const isBudget =
  msg.includes("budget") ||
  msg.includes("remaining budget") ||
  msg.includes("over budget") ||
  msg.includes("under budget");

const isFullAnalysis =
  msg.includes("full financial analysis") ||
  msg.includes("spending habits") ||
  msg.includes("financial report");
    // ---------------- GEMINI PROMPTS ----------------
    try {
      let prompt = "";

      const formatted = Object.entries(categoryTotals)
        .map(([c, a]) => `- ${c}: ₹${a}`)
        .join("\n");

      // 1️⃣ TOP SPENDING ONLY
      if (isTopSpend) {
        prompt = `
You are a financial assistant.

Answer ONLY:
- Where user spends most money
- 1 short insight
- 1 suggestion

Top Category: ${topCategory[0]} (₹${topCategory[1]})
`;
      }

      // 2️⃣ SAVINGS ONLY
      else if (isSaving) {
        prompt = `
You are a savings advisor.

Give ONLY:
- 3 practical saving tips
- Focus on "${topCategory[0]}"

Do NOT give full report.
`;
      }

      // 3️⃣ BUDGET ONLY
      else if (isBudget) {
        prompt = `
You are a budget analyst.

Give ONLY:
- Budget status
- Remaining amount
- Simple advice

Budget: ₹${budgetAmount}
Spent: ₹${totalSpent}
Remaining: ₹${remaining}
`;
      }

      // 4️⃣ FULL ANALYSIS
      else {
        prompt = `
You are a financial analyst.

Give FULL analysis:

1. Summary
2. Category breakdown
3. Spending behavior
4. 3 insights
5. 3 saving actions

DATA:
Budget: ₹${budgetAmount}
Spent: ₹${totalSpent}
Remaining: ₹${remaining}

Categories:
${formatted}

Question:
${message}
`;
      }

      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.();

      if (text?.trim()) reply = text;
    } catch (err) {
      console.log("⚠️ Gemini failed, using fallback");
    }

    // ---------------- SMART FALLBACK ----------------
    if (!reply) {

  // 1️⃣ TOP SPENDING
  if (isTopSpend) {

    const percent = Math.round(
      ((topCategory[1] as number) / totalSpent) * 100
    );

    reply = `
📌 Top Spending Category

Your highest spending category this month is **${topCategory[0]}**.

Amount Spent: ₹${topCategory[1]}
Percentage of Total Spending: ${percent}%

This category contributes the largest share of your monthly expenses.

💡 Recommendation:
Review transactions in this category and identify expenses that can be reduced.
`;

  }

  // 2️⃣ BREAKDOWN
  else if (isBreakdown) {

    const breakdown = sorted
      .map(([cat, amt]) => {
        const percent = Math.round(
          ((amt as number) / totalSpent) * 100
        );

        return `• ${cat}: ₹${amt} (${percent}%)`;
      })
      .join("\n");

    reply = `
📊 Expense Breakdown By Category

${breakdown}

💰 Total Spent: ₹${totalSpent}

This breakdown shows exactly where your money was allocated during the selected month.
`;

  }

  // 3️⃣ COMPARISON
  else if (isComparison) {

    const topTwo = sorted.slice(0, 2);

    reply = `
📈 Spending Pattern Analysis

Highest Category:
${topTwo[0]?.[0]} - ₹${topTwo[0]?.[1]}

Second Highest Category:
${topTwo[1]?.[0] || "N/A"} - ₹${topTwo[1]?.[1] || 0}

💡 Insight:
Most of your spending is concentrated in ${topTwo[0]?.[0]}.

A more balanced distribution can improve financial stability.
`;

  }

  // 4️⃣ SAVINGS
  else if (isSaving) {

    reply = `
💰 Expense Reduction Plan

Your biggest expense category is ${topCategory[0]} (₹${topCategory[1]}).

Recommended actions:

1. Reduce spending in ${topCategory[0]} by 15-20%.
2. Set weekly spending limits.
3. Review unnecessary purchases.
4. Track every expense for the next 30 days.

Potential Monthly Savings:
₹${Math.round((topCategory[1] as number) * 0.2)}
`;

  }

  // 5️⃣ BUDGET
  else if (isBudget) {

    const status =
      remaining >= 0
        ? "Within Budget"
        : "Over Budget";

    reply = `
📊 Budget Status Report

Budget: ₹${budgetAmount}
Spent: ₹${totalSpent}
Remaining: ₹${remaining}

Status: ${status}

${
  remaining >= 0
    ? "You are managing your budget well."
    : "You need to reduce spending to stay within budget."
}
`;

  }

  // 6️⃣ FULL ANALYSIS
  else {

    const breakdown = sorted
      .map(([cat, amt]) => {
        const percent = Math.round(
          ((amt as number) / totalSpent) * 100
        );

        return `• ${cat}: ₹${amt} (${percent}%)`;
      })
      .join("\n");

    reply = `
📊 Full Financial Analysis

💰 Total Spent: ₹${totalSpent}
🏦 Budget: ₹${budgetAmount}
📉 Remaining: ₹${remaining}

📌 Category Breakdown

${breakdown}

💡 Key Insights

• Highest spending category: ${topCategory[0]}
• Largest expense amount: ₹${topCategory[1]}
• Remaining budget: ₹${remaining}

📅 Action Plan

• Track expenses daily
• Reduce spending in ${topCategory[0]}
• Set category-wise limits
• Review spending every week
`;
  }
}
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    return res.status(500).json({
      reply: "Server error handled safely",
    });
  }
};