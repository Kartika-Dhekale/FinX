'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

import { toast } from 'sonner';

import Link from 'next/link';

import {
  ArrowLeft,
  Wallet,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

import { api } from '@/lib/api';

const categories = [
  'Food',
  'Travel',
  'Bills',
  'Shopping',
  'Entertainment',
  'Other',
];

const months = [
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
];

export default function BudgetPage() {
  // ================= STATES =================

  const [monthlyBudget, setMonthlyBudget] =
    useState<number>(3000);

  const [tempBudget, setTempBudget] =
    useState<string>('3000');

  const [isEditing, setIsEditing] =
    useState(false);

  const [expenses, setExpenses] =
    useState<number>(0);

  const [categoryBudgets, setCategoryBudgets] =
    useState<Record<string, number>>({});

  const [categoryExpenses, setCategoryExpenses] =
    useState<Record<string, number>>({});

  const [loading, setLoading] =
    useState<boolean>(true);

  // ================= MONTH + YEAR =================

  const [selectedMonth, setSelectedMonth] =
    useState<number>(
      new Date().getMonth()
    );

  const [selectedYear, setSelectedYear] =
    useState<number>(
      new Date().getFullYear()
    );

  // ================= LOAD DATA =================

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  const loadData = async () => {
    try {
      setLoading(true);

      // ================= LOAD EXPENSES =================

      const expensesData =
        await api.get('/expenses');

      console.log(
        'EXPENSES RESPONSE:',
        expensesData
      );

      const filteredExpenses =
        (expensesData || []).filter(
          (expense: any) => {
            const expenseDate =
              new Date(expense.date);

            return (
              expenseDate.getMonth() ===
                selectedMonth &&
              expenseDate.getFullYear() ===
                selectedYear
            );
          }
        );

      // ================= TOTAL EXPENSES =================

      const totalExpenses =
        filteredExpenses.reduce(
          (
            sum: number,
            expense: any
          ) =>
            sum +
            Number(
              expense.amount || 0
            ),
          0
        );

      setExpenses(totalExpenses);

      // ================= CATEGORY EXPENSES =================

      const categoryTotals: Record<
        string,
        number
      > = {};

      categories.forEach((cat) => {
        categoryTotals[cat] = 0;
      });

      filteredExpenses.forEach(
        (expense: any) => {
          const category =
            expense.category || 'Other';

          categoryTotals[category] =
            (categoryTotals[
              category
            ] || 0) +
            Number(
              expense.amount || 0
            );
        }
      );

      setCategoryExpenses(
        categoryTotals
      );

      // ================= LOAD BUDGET =================

      try {
        const budgetData =
          await api.get(
            `/budgets?month=${selectedMonth}&year=${selectedYear}`
          );

        console.log(
          'BUDGET RESPONSE:',
          budgetData
        );

        if (budgetData) {
          setMonthlyBudget(
            budgetData.monthlyBudget ||
              3000
          );

          setTempBudget(
            (
              budgetData.monthlyBudget ||
              3000
            ).toString()
          );

          // ================= CATEGORY BUDGETS =================

          const defaults: Record<
            string,
            number
          > = {};

          categories.forEach((cat) => {
            defaults[cat] =
              budgetData
                ?.categoryBudgets?.[
                cat
              ] || 0;
          });

          setCategoryBudgets(
            defaults
          );
        }
      } catch (error) {
        console.log(
          'No budget found'
        );

        // ================= RESET DEFAULTS =================

        setMonthlyBudget(3000);

        setTempBudget('3000');

        const defaults: Record<
          string,
          number
        > = {};

        categories.forEach((cat) => {
          defaults[cat] = 0;
        });

        setCategoryBudgets(
          defaults
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        'Failed to load data'
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= CATEGORY CHANGE =================

  const handleCategoryChange = (
    category: string,
    value: string
  ) => {
    setCategoryBudgets((prev) => ({
      ...prev,

      [category]:
        parseFloat(value) || 0,
    }));
  };

  // ================= SAVE MONTHLY BUDGET =================

  const handleSaveBudget =
    async () => {
      try {
        const budgetAmount =
          parseFloat(tempBudget);

        if (
          isNaN(budgetAmount) ||
          budgetAmount <= 0
        ) {
          toast.error(
            'Enter valid budget'
          );

          return;
        }

        const response =
          await api.post(
            '/budgets',
            {
              month: selectedMonth,

              year: selectedYear,

              monthlyBudget:
                budgetAmount,

              categoryBudgets,
            }
          );

        console.log(
          'SAVE RESPONSE:',
          response
        );

        setMonthlyBudget(
          budgetAmount
        );

        setTempBudget(
          budgetAmount.toString()
        );

        setIsEditing(false);

        toast.success(
          'Budget saved successfully'
        );

        await loadData();
      } catch (error) {
        console.error(error);

        toast.error(
          'Failed to save budget'
        );
      }
    };

  // ================= SAVE CATEGORY BUDGETS =================

  const saveCategoryBudgets =
    async () => {
      try {
        await api.post(
          '/budgets',
          {
            month: selectedMonth,

            year: selectedYear,

            monthlyBudget,

            categoryBudgets,
          }
        );

        toast.success(
          'Category budgets saved'
        );

        await loadData();
      } catch (error) {
        console.error(error);

        toast.error(
          'Failed to save category budgets'
        );
      }
    };

  // ================= CALCULATIONS =================

  const remainingBudget =
    monthlyBudget - expenses;

  const percentUsed =
    monthlyBudget > 0
      ? (expenses / monthlyBudget) *
        100
      : 0;

  const isWarning =
    percentUsed >= 80;

  const isOverBudget =
    percentUsed >= 100;

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F1A] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>

          <p className="text-lg">
            Loading budget...
          </p>
        </div>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-[#0B0F1A] p-6 text-white">
      {/* HEADER */}

      <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold">
            Budget Management
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your monthly
            finances smartly
          </p>
        </div>
      </div>

      {/* MONTH + YEAR */}

      <div className="mb-8 flex flex-wrap gap-4">
        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
              Number(
                e.target.value
              )
            )
          }
          className="rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none focus:border-cyan-400"
        >
          {months.map(
            (
              month,
              index
            ) => (
              <option
                key={month}
                value={index}
              >
                {month}
              </option>
            )
          )}
        </select>

        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(
              Number(
                e.target.value
              )
            )
          }
          className="rounded-xl border border-white/10 bg-[#111827] px-4 py-3 outline-none focus:border-cyan-400"
        >
          {[2024, 2025, 2026, 2027].map(
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

      {/* SUMMARY CARDS */}

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {/* TOTAL BUDGET */}

        <Card className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Total Budget
              </p>

              <h2 className="mt-2 text-3xl font-bold text-cyan-300">
                ₹
                {monthlyBudget.toFixed(
                  2
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-cyan-500/20 p-3">
              <Wallet className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </Card>

        {/* SPENT */}

        <Card className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Total Spent
              </p>

              <h2 className="mt-2 text-3xl font-bold text-red-400">
                ₹
                {expenses.toFixed(2)}
              </h2>
            </div>

            <div className="rounded-xl bg-red-500/20 p-3">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </Card>

        {/* REMAINING */}

        <Card className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Remaining
              </p>

              <h2
                className={`mt-2 text-3xl font-bold ${
                  remainingBudget <
                  0
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}
              >
                ₹
                {remainingBudget.toFixed(
                  2
                )}
              </h2>
            </div>

            <div className="rounded-xl bg-green-500/20 p-3">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* MAIN BUDGET */}

      <Card className="mb-8 rounded-2xl border border-white/10 bg-[#111827] p-8">
        {!isEditing ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  Monthly Budget
                </h2>

                <p className="mt-2 text-gray-400">
                  Budget usage
                  overview
                </p>
              </div>

              <Button
                onClick={() =>
                  setIsEditing(true)
                }
              >
                Edit Budget
              </Button>
            </div>

            {/* PROGRESS */}

            <div className="mt-8">
              <div className="mb-3 flex justify-between text-sm text-gray-400">
                <span>
                  Used:
                  {' '}
                  ₹
                  {expenses.toFixed(
                    2
                  )}
                </span>

                <span>
                  {percentUsed.toFixed(
                    0
                  )}
                  %
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-700">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    isOverBudget
                      ? 'bg-red-500'
                      : isWarning
                      ? 'bg-yellow-400'
                      : 'bg-cyan-400'
                  }`}
                  style={{
                    width: `${Math.min(
                      percentUsed,
                      100
                    )}%`,
                  }}
                />
              </div>

              {/* WARNING */}

              {isWarning && (
                <div
                  className={`mt-4 flex items-center gap-2 rounded-xl border p-4 ${
                    isOverBudget
                      ? 'border-red-500/30 bg-red-500/10 text-red-400'
                      : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300'
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />

                  <span>
                    {isOverBudget
                      ? 'You are over budget!'
                      : 'You are close to your budget limit.'}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-6 text-2xl font-bold">
              Edit Budget
            </h2>

            <div className="max-w-md">
              <Label className="mb-2 block">
                Monthly Budget
              </Label>

              <Input
                type="number"
                value={tempBudget}
                onChange={(e) =>
                  setTempBudget(
                    e.target.value
                  )
                }
                placeholder="Enter budget"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={
                  handleSaveBudget
                }
              >
                Save Budget
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(
                    false
                  );

                  setTempBudget(
                    monthlyBudget.toString()
                  );
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* CATEGORY BUDGETS */}

      <Card className="rounded-2xl border border-white/10 bg-[#111827] p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Category Budgets
            </h2>

            <p className="mt-2 text-gray-400">
              Set spending limits for
              each category
            </p>
          </div>

          <Button
            onClick={
              saveCategoryBudgets
            }
          >
            Save Categories
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((cat) => {
            const budget =
              categoryBudgets[
                cat
              ] || 0;

            const spent =
              categoryExpenses[
                cat
              ] || 0;

            const remaining =
              budget - spent;

            const percentage =
              budget > 0
                ? (spent /
                    budget) *
                  100
                : 0;

            return (
              <div
                key={cat}
                className="rounded-2xl border border-white/10 bg-[#0B1220] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Label className="text-lg font-semibold">
                    {cat}
                  </Label>

                  <span
                    className={`text-sm font-medium ${
                      remaining < 0
                        ? 'text-red-400'
                        : 'text-green-400'
                    }`}
                  >
                    ₹
                    {remaining.toFixed(
                      0
                    )}
                    {' '}
                    left
                  </span>
                </div>

                <Input
                  type="number"
                  value={
                    categoryBudgets[
                      cat
                    ] || ''
                  }
                  onChange={(e) =>
                    handleCategoryChange(
                      cat,
                      e.target.value
                    )
                  }
                  placeholder={`Enter ${cat} budget`}
                />

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm text-gray-400">
                    <span>
                      Spent: ₹
                      {spent.toFixed(
                        2
                      )}
                    </span>

                    <span>
                      {percentage.toFixed(
                        0
                      )}
                      %
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${
                        percentage >=
                        100
                          ? 'bg-red-500'
                          : percentage >=
                            80
                          ? 'bg-yellow-400'
                          : 'bg-cyan-400'
                      }`}
                      style={{
                        width: `${Math.min(
                          percentage,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}