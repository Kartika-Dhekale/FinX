'use client';

import { useEffect, useState } from 'react';
import TransactionList, { Transaction } from '@/components/dashboard/transaction-list';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Transaction[]>([]);

  const loadData = async () => {
    try {
      const res = await api.get('/expenses');

      const data = Array.isArray(res) ? res : res?.data || [];

console.log("RAW API DATA:", data);

data.forEach((item: any) => {
  console.log(JSON.stringify(item, null, 2));
});
const formatted = data.map((e: any) => ({
  id: e._id,
  title: e.title,
  amount: Number(e.amount),
  category: e.category,
  date: e.date || e.createdAt,
}));

      setExpenses(formatted);
    } catch (error) {
      toast.error('Failed to load expenses');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ DELETE (DB)
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Deleted successfully');
      loadData();
    } catch {
      toast.error('Delete failed');
    }
  };

  // ✅ EDIT (DB)
  const handleEdit = async (t: Transaction) => {
    const newTitle = prompt('Edit title', t.title);
    const newAmount = prompt('Edit amount', t.amount.toString());

    if (!newTitle || !newAmount) return;

    try {
      await api.put(`/expenses/${t.id}`, {
        title: newTitle,
        amount: Number(newAmount),
      });

      toast.success('Updated successfully');
      loadData();
    } catch {
      toast.error('Update failed');
    }
  };


const grouped = expenses.reduce((acc: any, item) => {

  console.log("GROUP DATE:", item.date);

  const parsedDate = new Date(item.date);

  console.log("PARSED DATE:", parsedDate);

    const key = isNaN(parsedDate.getTime())
    ? "Unknown Date"
    : parsedDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {});

  return (
    <div className="p-8 bg-[#0B0F1A] min-h-screen text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <Link href="/dashboard" className="flex items-center gap-2 text-cyan-400 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <h1 className="text-3xl font-bold">All Expenses</h1>
          <p className="text-gray-400">Track and manage your spending</p>
        </div>

        <Link
          href="/dashboard/expenses/add"
          className="flex items-center gap-2 px-5 h-11 rounded-xl 
          bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </Link>

      </div>

      {/* CONTENT */}
      {expenses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No expenses yet 💸
        </div>
      ) : (
        Object.keys(grouped).map((month) => (
          <div key={month} className="mb-10">

            <h2 className="text-xl font-semibold text-cyan-400 mb-4">
              {month}
            </h2>

            <TransactionList
              transactions={grouped[month]}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />

          </div>
        ))
      )}
    </div>
  );
}