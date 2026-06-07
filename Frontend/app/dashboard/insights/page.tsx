"use client";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
} from "recharts";

import {
useEffect,
useState,
} from "react";

import { api } from "@/lib/api";

export default function InsightsPage() {
const [data, setData] =
useState<any>(null);

const [month, setMonth] =
useState(
new Date().getMonth() + 1
);

const [year, setYear] =
useState(
new Date().getFullYear()
);

useEffect(() => {
loadInsights();
}, [month, year]);

const loadInsights =
async () => {
const result =
await api.get(
`/ai/insights?month=${month}&year=${year}`
);


  setData(result);
};


return ( <div className="p-8 text-white">

  <div className="flex justify-between mb-8">

    <h1 className="text-3xl font-bold">
      AI Insights
    </h1>

    <div className="flex gap-3">

      <select
        value={month}
        onChange={(e) =>
          setMonth(
            Number(
              e.target.value
            )
          )
        }
        className="bg-[#111827] p-2 rounded"
      >
        {Array.from(
          { length: 12 },
          (_, i) => (
            <option
              key={i + 1}
              value={i + 1}
            >
              {i + 1}
            </option>
          )
        )}
      </select>

      <input
        type="number"
        value={year}
        onChange={(e) =>
          setYear(
            Number(
              e.target.value
            )
          )
        }
        className="bg-[#111827] p-2 rounded w-24"
      />
    </div>

  </div>

  <div className="grid md:grid-cols-4 gap-6 mb-8">

    <div className="bg-[#111827] p-6 rounded-xl">
      <p>Total Spend</p>
      <h2 className="text-3xl font-bold">
        ₹
        {
          data?.summary
            ?.totalSpent
        }
      </h2>
    </div>

    <div className="bg-[#111827] p-6 rounded-xl">
      <p>Budget</p>
      <h2 className="text-3xl font-bold">
        ₹
        {
          data?.summary
            ?.monthlyBudget
        }
      </h2>
    </div>

    <div className="bg-[#111827] p-6 rounded-xl">
      <p>Savings</p>
      <h2 className="text-3xl font-bold text-green-400">
        ₹
        {
          data?.summary
            ?.savings
        }
      </h2>
    </div>

    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 rounded-xl">
      <p>
        Financial Score
      </p>

      <h2 className="text-5xl font-bold">
        {
          data?.financialScore
        }
      </h2>
    </div>

  </div>
  <div className="grid md:grid-cols-3 gap-6 mb-8">

  <div className="bg-[#111827] p-6 rounded-xl">
    <h3 className="text-cyan-400 font-semibold">
      Budget Usage
    </h3>

    <p className="text-4xl font-bold mt-3">
      {data?.analytics?.budgetUsage}%
    </p>
  </div>

  <div className="bg-[#111827] p-6 rounded-xl">
    <h3 className="text-cyan-400 font-semibold">
      Spending Trend
    </h3>

    <p className="text-2xl font-bold mt-3">
      {data?.analytics?.trend}
    </p>
  </div>

  <div className="bg-[#111827] p-6 rounded-xl">
    <h3 className="text-cyan-400 font-semibold">
      Budget Risk
    </h3>

    <p className="text-xl mt-3">
      {data?.analytics?.riskPrediction}
    </p>
  </div>

</div>

  <div className="bg-[#111827] p-6 rounded-xl mb-8">

    <h2 className="font-bold mb-4">
      Expense Breakdown
    </h2>

    <div
      style={{
        width: "100%",
        height: 350,
      }}
    >
      <ResponsiveContainer>
        <BarChart
          data={
            data?.categoryChartData
          }
        >
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="amount"
            fill="#06b6d4"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
  <div className="bg-[#111827] p-6 rounded-xl mb-8">

  <h2 className="font-bold mb-4">
    Top Spending Category
  </h2>

  <div className="flex justify-between">

    <div>
      <p className="text-gray-400">
        Category
      </p>

      <h3 className="text-2xl font-bold text-cyan-400">
        {data?.analytics?.topCategory?.category}
      </h3>
    </div>

    <div>
      <p className="text-gray-400">
        Amount
      </p>

      <h3 className="text-2xl font-bold">
        ₹{data?.analytics?.topCategory?.amount}
      </h3>
    </div>

  </div>

</div>


<div className="bg-[#111827] p-6 rounded-xl">
  <h2 className="text-xl font-bold mb-4">
    🤖 AI Financial Insights
  </h2>

  <div className="space-y-4">
    {data?.aiInsights?.map(
      (item: any, index: number) => (
        <div
          key={index}
          className="bg-[#0f172a] p-4 rounded-lg border border-cyan-500/20"
        >
          <h3 className="font-semibold text-cyan-400">
            {item.title}
          </h3>

          <p className="text-gray-300 mt-2">
            {item.description}
          </p>
        </div>
      )
    )}
  </div>
</div>
  </div>



);
}
