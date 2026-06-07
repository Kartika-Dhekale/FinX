'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Coffee,
  Plane,
  ShoppingBag,
  Zap,
  MapPin,
  Music,
  Pencil,
  Trash2,
  LucideIcon,
} from 'lucide-react';

export interface Transaction {
  id: string;
  title: string;
  category: 'Food' | 'Travel' | 'Bills' | 'Shopping' | 'Entertainment' | 'Other';
  amount: number;
  date: string;
}

const categoryIcons: Record<Transaction['category'], LucideIcon> = {
  Food: Coffee,
  Travel: Plane,
  Bills: Zap,
  Shopping: ShoppingBag,
  Entertainment: Music,
  Other: MapPin,
};

const categoryColors: Record<Transaction['category'], string> = {
  Food: 'bg-orange-500/10 text-orange-400',
  Travel: 'bg-blue-500/10 text-blue-400',
  Bills: 'bg-red-500/10 text-red-400',
  Shopping: 'bg-purple-500/10 text-purple-400',
  Entertainment: 'bg-green-500/10 text-green-400',
  Other: 'bg-gray-500/10 text-gray-300',
};

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
}: Props) {
  return (
    <Card className="p-6 bg-[#111827] border border-white/10 rounded-2xl">
      
      <h3 className="text-xl font-bold text-white mb-6">
        All Transactions
      </h3>

      <div className="space-y-4">

        {transactions.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No transactions yet 🚀
          </p>
        ) : (
          transactions.map((t) => {
            const Icon = categoryIcons[t.category];

            return (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
              >

                {/* LEFT SIDE */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${categoryColors[t.category]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="text-white font-semibold">
                      {t.title}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {t.category}
                    </p>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="text-right">

                  <p className="text-red-400 font-bold">
                    -₹{Number(t.amount).toFixed(2)}
                  </p>

                  <p className="text-xs text-gray-400">
                    {t.date}
                  </p>

                  <div className="flex gap-2 mt-2 justify-end">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(t)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(t.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                  </div>

                </div>

              </div>
            );
          })
        )}

      </div>

    </Card>
  );
}