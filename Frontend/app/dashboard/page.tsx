'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Clock3,
  CreditCard,
} from 'lucide-react';

import {
  Card,
} from '@/components/ui/card';

import {
  ExpenseChart,
} from '@/components/dashboard/expense-chart';

import {
  HealthScore,
} from '@/components/dashboard/health-score';

import TransactionList, {
  type Transaction,
} from '@/components/dashboard/transaction-list';

import { api } from '@/lib/api';

import { toast } from 'sonner';

export default function DashboardPage() {

  const router = useRouter();


  // ================= AUTH =================
  const [isAuth, setIsAuth] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  // ================= USER =================
  const [userName, setUserName] =
    useState('User');

  // ================= CLOCK =================
  const [currentTime, setCurrentTime] =
    useState(new Date());

  // ================= MONTH FILTER =================
  const [selectedMonth, setSelectedMonth] =
    useState(new Date().getMonth());

  const [selectedYear, setSelectedYear] =
    useState(new Date().getFullYear());
    const [
  categoryHeatmap,
  setCategoryHeatmap,
] = useState<any[]>([]);

  // ================= DATA =================
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);


  const [chartData, setChartData] =
    useState<
      Array<{
        name: string;
        value: number;
      }>
    >([]);

  const [topCategories, setTopCategories] =
    useState<
      Array<{
        category: string;
        amount: number;
      }>
    >([]);

  const [heatmapData, setHeatmapData] =
    useState<
      Array<{
        date: string;
        total: number;
      }>
    >([]);

  // ================= STATS =================
  const [totalExpenses, setTotalExpenses] =
    useState(0);

  const [monthlyBudget, setMonthlyBudget] =
    useState(3000);

  const [healthScore, setHealthScore] =
    useState(0);

  // ================= LIVE CLOCK =================
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // ================= GREETING =================
  const getGreeting = () => {

    const hour = currentTime.getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    }

    if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    }

    if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    }

    return 'Good Night';
  };

  // ================= AUTH CHECK =================
  useEffect(() => {

    const token =
      localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    setIsAuth(true);

  }, [router]);

  // ================= USER LOAD =================
  useEffect(() => {

    const storedUser =
      localStorage.getItem('user');

    if (storedUser) {

      try {

        const parsedUser =
          JSON.parse(storedUser);

        setUserName(
          parsedUser?.name ||
          parsedUser?.username ||
          'User'
        );

      } catch (error) {
        console.error(error);
      }
    }

  }, []);

  // ================= LOAD BUDGET =================

const loadBudget = async () => {

  try {

    const budgetData =
      await api.get(
        `/budgets?month=${selectedMonth}&year=${selectedYear}`
      );

    console.log(
      'DASHBOARD BUDGET:',
      budgetData
    );
    console.log("FULL BUDGET DATA", budgetData);
    console.log("CATEGORY BUDGETS", budgetData.categoryBudgets);
    if (budgetData) {

      setMonthlyBudget(
        budgetData.monthlyBudget || 3000
      );
      

    } else {

      setMonthlyBudget(3000);
    }

  } catch (error) {

    console.log(
      'No budget found'
    );

    setMonthlyBudget(3000);
  }
};

  // ================= LOAD DATA =================
  const loadData = async () => {

    try {

      setLoading(true);

      const data =
        await api.get('/expenses');

      const expensesRaw =
        Array.isArray(data)
          ? data
          : data?.data || [];
      console.log("RAW EXPENSES:", expensesRaw);
      expensesRaw.forEach((e: any) => {
  console.log(
    "DATE:",
    e.date,
    "MONTH:",
    new Date(e.date).getMonth(),
    "YEAR:",
    new Date(e.date).getFullYear()
  );
});


      // ================= FILTER BY MONTH =================
   const filteredExpenses = expensesRaw.filter(
  (expense: any) => {

    const expenseDate = new Date(
      expense.date ||
      expense.createdAt
    );

    return (
      expenseDate.getMonth() === selectedMonth &&
      expenseDate.getFullYear() === selectedYear
    );
  }
);

console.log(
  "FILTERED EXPENSES:",
  filteredExpenses
);
        

console.log(
  "MONTH:",
  selectedMonth
);

console.log(
  "YEAR:",
  selectedYear
);
console.log(expensesRaw[0]);
console.log(
  Object.keys(expensesRaw[0])
);

      // ================= FORMAT =================
const expenses: Transaction[] =
  filteredExpenses.map((e: any) => ({
    id: e._id,
    title: e.title,
    amount: Number(e.amount),
    category: e.category,
    date:
      e.date ||
      e.createdAt,
  }));
      // ================= TOTAL =================
      const total =
        expenses.reduce(
          (sum, expense) =>
            sum + expense.amount,
          0
        );

      setTotalExpenses(total);

      // ================= CATEGORY TOTALS =================
      const categoryTotals:
        Record<string, number> = {};

      expenses.forEach((expense) => {

        categoryTotals[
          expense.category
        ] =
          (categoryTotals[
            expense.category
          ] || 0) +
          expense.amount;
      });
      

      // ================= CHART DATA =================
      const chartArray =
        Object.entries(categoryTotals).map(
          ([name, value]) => ({
            name,
            value,
          })
        );

      setChartData(chartArray);

      // ================= TOP CATEGORIES =================
      const top =
        Object.entries(categoryTotals)
          .map(([category, amount]) => ({
            category,
            amount,
          }))
          .sort((a, b) =>
            b.amount - a.amount
          )
          .slice(0, 5);

      setTopCategories(top);

      // ================= HEATMAP =================
const dailyTotals: Record<string, number> = {};

expenses.forEach((expense) => {

  const day =
    new Date(expense.date)
      .toISOString()
      .split("T")[0];

  dailyTotals[day] =
    (dailyTotals[day] || 0) +
    expense.amount;
});

const heatmap =
  Object.entries(dailyTotals).map(
    ([date, total]) => ({
      date,
      total,
    })
  );
  setCategoryHeatmap(
  categoryHeatmap
);


setHeatmapData(heatmap);
// ================= HEALTH SCORE =================



const currentBudget =
  monthlyBudget || 3000;

const usage =
  currentBudget > 0
    ? (total / currentBudget) * 100
    : 0;

// Better score formula
let score = 100 - usage;

// Clamp between 0 and 100
score = Math.max(0, Math.min(100, score));
console.log('TOTAL:', total);
console.log('MONTHLY BUDGET:', monthlyBudget);
console.log('USAGE:', usage);
console.log('SCORE:', score);

setHealthScore(Math.round(score));
      // ================= RECENT =================
      setTransactions(
        expenses.reverse()
      );

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to load dashboard data'
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= LOAD EVERYTHING =================
  useEffect(() => {

    if (isAuth) {

      loadBudget();

      loadData();
    }

  }, [
    isAuth,
    selectedMonth,
    selectedYear,
  ]);

  // ================= LOADING =================
  if (loading) {

    return (
      <div className="text-white p-6">
        Loading...
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  // ================= CALCULATIONS =================
  const usagePercent =
    monthlyBudget > 0
      ? (totalExpenses / monthlyBudget) * 100
      : 0;

  const remaining =
    monthlyBudget - totalExpenses;

  // ================= UI =================
  return (

    <div className="p-8 text-white">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            {getGreeting()},{' '}

            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {userName}
            </span>{' '}

            👋
          </h1>

          <p className="text-gray-400 mt-2">
            Financial overview for selected month
          </p>
        </div>

        {/* CLOCK */}
        <div className="bg-[#111827] border border-white/10 px-6 py-4 rounded-2xl">

          <div className="flex items-center gap-3">

            <Clock3 className="text-cyan-400" />

            <div>

              <p className="text-sm text-gray-400">

                {currentTime.toLocaleDateString(
                  'en-IN',
                  {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  }
                )}
              </p>

              <p className="text-2xl font-bold text-cyan-400">

                {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MONTH FILTER ================= */}
      <div className="flex gap-4 mb-8">

        {/* MONTH */}
        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
              Number(e.target.value)
            )
          }
          className="bg-[#111827] border border-white/10 px-4 py-3 rounded-xl"
        >

          {[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ].map((month, index) => (

            <option
              key={month}
              value={index}
            >
              {month}
            </option>
          ))}
        </select>

        {/* YEAR */}
        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(
              Number(e.target.value)
            )
          }
          className="bg-[#111827] border border-white/10 px-4 py-3 rounded-xl"
        >

          {[2024, 2025, 2026].map(
            (year) => (

              <option
                key={year}
                value={year}
              >
                {year}
              </option>
            )
          )}
        </select>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

       {/* REMAINING */}
<Card className="bg-[#111827] border border-white/10 p-6">

  <div className="flex items-center gap-3 mb-3">

    <TrendingUp className="text-green-400" />

    <p className="text-gray-400 text-sm">
      Remaining
    </p>

  </div>

  <p className="text-3xl font-bold text-green-400">
    ₹{remaining.toFixed(2)}
  </p>

</Card>

{/* BUDGET */}
<Card className="bg-[#111827] border border-white/10 p-6">

  <div className="flex items-center gap-3 mb-3">

    <PieChartIcon className="text-blue-400" />

    <p className="text-gray-400 text-sm">
      Monthly Budget
    </p>

  </div>

  <p className="text-3xl font-bold text-blue-400">
    ₹{monthlyBudget.toFixed(2)}
  </p>

</Card>

{/* TOTAL */}
<Card className="bg-[#111827] border border-white/10 p-6">

  <div className="flex items-center gap-3 mb-3">

    <BarChart3 className="text-red-400" />

    <p className="text-gray-400 text-sm">
      Total Spent
    </p>

  </div>

  <p className="text-3xl font-bold text-red-400">
    ₹{totalExpenses.toFixed(2)}
  </p>

</Card>

        {/* USAGE */}
        <Card className="bg-[#111827] border border-white/10 p-6">

          <p className="text-gray-400 text-sm">
            Budget Usage
          </p>

          <p className="text-3xl font-bold text-cyan-400 mt-2">
            {usagePercent.toFixed(0)}%
          </p>

          <div className="bg-gray-700 h-2 rounded-full mt-4">

            <div
              className="bg-cyan-400 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  usagePercent,
                  100
                )}%`,
              }}
            />
          </div>
        </Card>
      </div>

      {/* ================= CHART + HEALTH ================= */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">

        <div className="lg:col-span-2">

          {chartData.length > 0 ? (

            <ExpenseChart data={chartData} />

          ) : (

            <div className="bg-[#111827] border border-white/10 rounded-xl p-10 text-center text-gray-400">
              No expenses for this month
            </div>
          )}
        </div>

        <HealthScore score={healthScore} />
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">

        {/* TOP CATEGORIES */}
        <Card className="bg-[#111827] border border-white/10 p-6">

          <h2 className="text-2xl font-bold mb-6">
            Top Categories
          </h2>

          <div className="space-y-4">

            {topCategories.map((item) => (

              <div
                key={item.category}
                className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl"
              >

                <span>
                  {item.category}
                </span>

                <span className="text-orange-400 font-bold">
                  ₹{item.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>

       {/* CATEGORY BUDGET HEATMAP */}
<Card className="bg-[#111827] border border-white/10 p-6">

  <h2 className="text-2xl font-bold mb-6">
    Spending Heatmap
  </h2>

  <div className="grid grid-cols-7 gap-3">

    {heatmapData.map((day) => {

      const intensity =
        day.total > 5000
          ? 'bg-red-500'
          : day.total > 3000
          ? 'bg-orange-400'
          : day.total > 1000
          ? 'bg-yellow-400'
          : 'bg-green-400';

      return (

        <div
          key={day.date}
          className={`h-20 rounded-2xl ${intensity} flex flex-col justify-center items-center`}
        >

          <p className="font-bold text-black">
            {new Date(day.date).getDate()}
          </p>

          <p className="text-[10px] text-black">
            ₹{day.total}
          </p>

        </div>
      );
    })}

  </div>

</Card>

</div> {/* closes analytics grid */}


    </div>
  );

}