'use client';

import { api } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Textarea } from '@/components/ui/textarea';

import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),

  amount: z.coerce
    .number()
    .min(1, 'Amount must be greater than 0'),

  category: z.enum([
    'Food',
    'Travel',
    'Bills',
    'Shopping',
    'Entertainment',
    'Other',
  ]),

  notes: z.string().max(500).optional(),

  date: z.string().min(1, 'Date is required'),
});

type ExpenseForm = z.infer<typeof expenseSchema>;

const categories = [
  'Food',
  'Travel',
  'Bills',
  'Shopping',
  'Entertainment',
  'Other',
];

export function AddExpenseForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),

    defaultValues: {
      title: '',
      amount: 0,
      category: 'Food',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedCategory = watch('category');

  // SUBMIT
  const onSubmit = async (data: ExpenseForm) => {
    try {
      setIsLoading(true);

      await api.post('/expenses', {
        title: data.title,
        amount: Number(data.amount),
        category: data.category,
        notes: data.notes,
        date: data.date,
      });

      toast.success('Expense added successfully!');

      reset({
        title: '',
        amount: 0,
        category: 'Food',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });

      router.push('/dashboard/expenses');

    } catch (error) {
      console.error(error);
      toast.error('Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">

      {/* BACK */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-cyan-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* TITLE */}
      <h1 className="mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">
        Add New Expense
      </h1>

      <p className="mb-8 text-gray-400">
        Track your spending ✨
      </p>

      {/* CARD */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-xl">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* TITLE */}
          <div>
            <Label className="mb-2 block text-gray-300">
              Expense Title
            </Label>

            <Input
              placeholder="e.g. Swiggy Order"
              {...register('title')}
              className="border border-white/10 bg-white/5 text-white placeholder:text-gray-400"
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* AMOUNT */}
          <div>
            <Label className="mb-2 block text-gray-300">
              Amount
            </Label>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                ₹
              </span>

              <Input
                type="number"
                step="0.01"
                {...register('amount')}
                className="border border-white/10 bg-white/5 pl-8 text-white"
              />
            </div>

            {errors.amount && (
              <p className="mt-1 text-sm text-red-400">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <Label className="mb-2 block text-gray-300">
              Category
            </Label>

            <Select
              value={selectedCategory}
              onValueChange={(value) =>
                setValue(
                  'category',
                  value as ExpenseForm['category']
                )
              }
            >
              <SelectTrigger className="border border-white/10 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="border border-white/10 bg-[#111827] text-white">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* NOTES */}
          <div>
            <Label className="mb-2 block text-gray-300">
              Notes
            </Label>

            <Textarea
              rows={4}
              placeholder="Add extra details about this expense..."
              {...register('notes')}
              className="border border-white/10 bg-white/5 text-white placeholder:text-gray-400 resize-none"
            />

            {errors.notes && (
              <p className="mt-1 text-sm text-red-400">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* DATE */}
          <div>
            <Label className="mb-2 block text-gray-300">
              Date
            </Label>

            <Input
              type="date"
              {...register('date')}
              className="border border-white/10 bg-white/5 text-white"
            />

            {errors.date && (
              <p className="mt-1 text-sm text-red-400">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold text-white hover:from-cyan-400 hover:to-purple-600"
            >
              {isLoading ? 'Adding...' : 'Add Expense'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-12 flex-1 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
}