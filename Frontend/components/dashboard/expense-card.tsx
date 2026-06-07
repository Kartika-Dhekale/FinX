import { Card } from '@/components/ui/card';

interface ExpenseCardProps {
  title: string;
  amount: number;
  currency?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent';
}

export function ExpenseCard({
  title,
  amount,
  currency = '₹',
  icon,
  color = 'primary',
}: ExpenseCardProps) {
  const colorClasses = {
    primary: 'bg-cyan-500/10 text-cyan-400',
    secondary: 'bg-purple-500/10 text-purple-400',
    accent: 'bg-emerald-500/10 text-emerald-400',
  };

  const amountColor = {
    primary: 'from-cyan-400 to-blue-500',
    secondary: 'from-purple-400 to-pink-500',
    accent: 'from-emerald-400 to-green-500',
  };

  // ✅ Indian currency format
  const formattedAmount = amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className="p-6 bg-[#111827] border border-white/10 rounded-xl shadow-md">
      <div className="flex items-start justify-between">
        <div>
          {/* Title */}
          <p className="text-sm font-medium text-gray-400 mb-1">
            {title}
          </p>

          {/* 🔥 UPDATED AMOUNT */}
          <p
            className={`text-3xl font-extrabold bg-gradient-to-r ${amountColor[color]} bg-clip-text text-transparent`}
          >
            {currency} {formattedAmount}
          </p>
        </div>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}