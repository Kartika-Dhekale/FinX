"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const COLORS = [
  "#22c55e",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];
import { useEffect, useState } from "react";
import { api } from "@/lib/api";


export default function PredictionPage() {

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadPrediction();
  }, []);

  const loadPrediction =
    async () => {

      try {

        const result =
          await api.get(
            "/predictions"
          );

        console.log(result);

        setData(result);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  if (loading) {

    return (
      <div className="p-8 text-white">
        Loading Prediction...
      </div>
    );
  }

  return (

    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold mb-8">
        🔮 Expense Prediction & Analytics
      </h1>

      {/* KPI Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-[#111827] p-6 rounded-xl">

          <p className="text-gray-400">
            Current Spend
          </p>

          <h2 className="text-3xl font-bold">
            ₹{data?.currentSpend || 0}
          </h2>

        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-cyan-500/20">

          <p className="text-gray-400">
            ML Prediction
          </p>

          <h2 className="text-3xl font-bold text-cyan-400">
            ₹{data?.prediction || 0}
          </h2>

        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-green-500/20">

          <p className="text-gray-400">
            Budget
          </p>

          <h2 className="text-3xl font-bold text-green-400">
            ₹{data?.monthlyBudget || 0}
          </h2>

        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-yellow-500/20">

          <p className="text-gray-400">
            Savings Potential
          </p>

          <h2 className="text-3xl font-bold text-yellow-400">
            ₹{data?.savingsPotential || 0}
          </h2>

        </div>

      </div>

      {/* Budget Alert */}

      {data?.risk && (

        <div className="bg-red-500/10 border border-red-500 p-6 rounded-xl mb-8">

          <h2 className="text-xl font-bold text-red-400">
            ⚠ Budget Alert
          </h2>

          <p className="mt-2">

            Based on ML prediction,
            you may exceed your budget by

            <span className="font-bold">
              {" "}₹{data?.overrun}
            </span>

          </p>

        </div>

      )}

      {/* Suggestions */}

      <div className="bg-[#111827] p-6 rounded-xl mb-8">

        <h2 className="text-xl font-bold mb-4">
          💡 AI Savings Suggestions
        </h2>

        <ul className="space-y-3">

          {data?.suggestions?.map(
            (
              item: string,
              index: number
            ) => (

              <li
                key={index}
                className="bg-[#0f172a] p-3 rounded-lg"
              >
                {item}
              </li>

            )
          )}

        </ul>

      </div>

      {/* Monthly Analytics */}

      <div className="bg-[#111827] p-6 rounded-xl mb-8">

  <h2 className="text-xl font-bold mb-4">
    📈 Monthly Spending Trend
  </h2>

  <div style={{ width: "100%", height: 300 }}>

    <ResponsiveContainer>

      <LineChart
        data={data?.monthlyChartData}
      >

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="amount"
          stroke="#22c55e"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>

      {/* Raw Monthly Data */}

     {/* Historical Data + Category Distribution */}
{/* Historical Data + Category Distribution */}

<div className="grid lg:grid-cols-2 gap-8 mt-8">

  {/* Historical Data */}
  <div className="bg-[#111827] p-6 rounded-xl h-fit">

    <h2 className="text-xl font-bold mb-6">
      📅 Historical Monthly Data
    </h2>

    <div className="space-y-4">

      {Object.entries(
        data?.monthlyData || {}
      ).map(([month, amount]: any) => (

        <div
          key={month}
          className="flex justify-between items-center p-4 bg-[#0f172a] rounded-lg"
        >
          <span className="font-medium">
            {month}
          </span>

          <span className="font-bold text-cyan-400">
            ₹{amount}
          </span>
        </div>

      ))}

    </div>

  </div>

  {/* Category Distribution */}
  <div className="bg-[#111827] p-6 rounded-xl">

    <h2 className="text-xl font-bold mb-6">
      Category Distribution
    </h2>

    <div className="grid md:grid-cols-[55%_45%] gap-6 items-center">
      {/* Chart */}

      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

           <Pie
  data={data?.categoryChartData}
  dataKey="amount"
  nameKey="category"
  cx="40%"
  cy="50%"
  outerRadius={90}
  labelLine={false}
>

              {data?.categoryChartData?.map(
                (_: any, index: number) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />

                )
              )}

            </Pie>

            <Tooltip
              formatter={(
                value: any
              ) => [`₹${value}`]}
            />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Legend */}

      <div className="space-y-4">

        {data?.categoryChartData?.map(
          (
            item: any,
            index: number
          ) => (

            <div
              key={index}
              className="flex justify-between items-center bg-[#0f172a] p-3 rounded-lg"
            >

              <div className="flex items-center gap-3">

                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[
                        index %
                          COLORS.length
                      ],
                  }}
                />

                <span>
                  {item.category}
                </span>

              </div>

             <span className="font-semibold">
  ₹{item.amount}
</span>

<span className="text-gray-400 text-sm">
  (
  {(
    (item.amount /
      data.categoryChartData.reduce(
        (a: number, b: any) =>
          a + b.amount,
        0
      )) *
    100
  ).toFixed(1)}
  %)
</span>
              

            </div>

          )
        )}

      </div>

    </div>

  </div>

</div>

   </div>

  
  );
}