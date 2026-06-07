'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { api } from '@/lib/api';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📅 filters
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await api.get('/admin/expenses');
      setExpenses(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FILTER BY MONTH + YEAR
  const filteredExpenses = expenses.filter((exp) => {
    const date = new Date(exp.createdAt);
    return (
      date.getMonth() === Number(month) &&
      date.getFullYear() === Number(year)
    );
  });
  const exportCSV = () => {
  const headers = ['Title', 'Category', 'User', 'Date', 'Amount'];

  const rows = filteredExpenses.map((exp) => [
    exp.title,
    exp.category,
    exp.user?.name || 'Unknown',
    new Date(exp.createdAt).toLocaleDateString(),
    exp.amount,
  ]);

  const csvContent =
    [headers, ...rows]
      .map((e) => e.join(','))
      .join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `expenses_${month + 1}_${year}.csv`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="min-h-screen bg-[#08111F] text-white flex">
      <AdminSidebar />

      <div className="ml-[260px] w-full p-8">

        <h1 className="text-4xl font-bold mb-6">
          Expenses Management
        </h1>

      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl">

  {/* MONTH CHIPS */}
  <div className="flex flex-wrap gap-2">
    {[
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ].map((m, i) => (
      <button
        key={i}
        onClick={() => setMonth(i)}
        className={`px-3 py-1 rounded-full text-sm transition-all
          ${
            month === i
              ? 'bg-cyan-500 text-black font-semibold'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
      >
        {m}
      </button>
    ))}
  </div>

  {/* RIGHT SIDE CONTROLS */}
  <div className="ml-auto flex items-center gap-3">

    {/* YEAR */}
    <select
      value={year}
      onChange={(e) => setYear(Number(e.target.value))}
      className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white outline-none"
    >
      {[2024, 2025, 2026, 2027].map((y) => (
        <option key={y} value={y} className="text-black">
          {y}
        </option>
      ))}
    </select>

    {/* EXPORT BUTTON */}
    <button
      onClick={exportCSV}
      className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-black font-semibold transition-all"
    >
      Export CSV
    </button>

  </div>

</div>

        {/* LOADING */}
        {loading ? (
          <div>Loading...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-gray-400">
            No expenses found for selected month
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">

            {/* TABLE */}
            <table className="w-full text-left">

              <thead className="border-b border-white/10">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense: any) => (
                  <tr
                    key={expense._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4">{expense.title}</td>

                    <td className="p-4 text-gray-300">
                      {expense.category}
                    </td>

                    <td className="p-4 text-gray-400">
                      {expense.user?.name || 'Unknown'}
                    </td>

                    <td className="p-4 text-gray-500">
                      {new Date(expense.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-cyan-400 font-bold">
                      ₹ {expense.amount}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}