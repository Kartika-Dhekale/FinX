'use client';

import {
  Users,
  Wallet,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

type Props = {
  stats: {
    totalUsers: number;
    totalExpenses: number;
    totalAmount: number;
    monthlyExpenses: number;
  };
};

const cards = [
  {
    key: 'totalUsers',
    title: 'Total Users',
    icon: Users,
    color:
      'from-cyan-500 to-blue-500',
  },
  {
    key: 'totalExpenses',
    title: 'Expenses',
    icon: CreditCard,
    color:
      'from-purple-500 to-pink-500',
  },
  {
    key: 'totalAmount',
    title: 'Revenue',
    icon: Wallet,
    color:
      'from-green-500 to-emerald-500',
  },
  {
    key: 'monthlyExpenses',
    title: 'Monthly',
    icon: TrendingUp,
    color:
      'from-orange-500 to-red-500',
  },
];

export default function StatsCards({
  stats,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold text-white mt-2">
                  {
                    stats[
                      card.key as keyof typeof stats
                    ]
                  }
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center`}
              >
                <Icon className="text-white w-7 h-7" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}