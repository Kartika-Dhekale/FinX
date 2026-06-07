'use client';
import {
BarChart,
Bar,
XAxis,
Tooltip,
ResponsiveContainer,
} from 'recharts';
const data = [
{
month: 'Jan',
amount: 4000,
},
{
month: 'Feb',
amount: 3200,
},
{
month: 'Mar',
amount: 5200,
},
{
month: 'Apr',
amount: 6100,
},
];
export default function ExpenseChart() {
return (
<div className="rounded-2xl border border-white/10 bg-white/5 p-6 h
[400px]">
<h2 className="text-2xl font-semibold mb-6 text-white">
Expense Analytics
</h2>
<ResponsiveContainer width="100%" height="100%">
<BarChart data={data}>
<XAxis dataKey="month" />
<Tooltip />

<Bar dataKey="amount" radius={[10, 10, 0, 0]} />
</BarChart>
</ResponsiveContainer>
</div>
);
}