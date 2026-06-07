'use client';

import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ExpenseChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = [
  '#22d3ee', // cyan
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
];

export function ExpenseChart({ data }: ExpenseChartProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6 bg-[#111827] border border-white/10 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">
          Expense Breakdown
        </h3>

        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>No expenses to display</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-[#111827] border border-white/10 rounded-xl shadow-lg">
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-4">
        Expense Breakdown
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* ✅ Tooltip with ₹ */}
          <Tooltip
            contentStyle={{
              backgroundColor: '#0B0F1A',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              color: '#fff',
            }}
            formatter={(value: number) => `₹${value.toFixed(2)}`}
          />

          {/* Legend */}
          <Legend
            wrapperStyle={{
              color: '#d1d5db',
              fontSize: '14px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}