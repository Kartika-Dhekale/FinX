'use client';

import { Card } from '@/components/ui/card';

interface HealthScoreProps {
  score: number; // 0-100
}

export function HealthScore({ score }: HealthScoreProps) {
  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // green
    if (s >= 60) return '#3b82f6'; // blue
    if (s >= 40) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const getLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Poor';
  };

  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (score / 100) * circumference;

  return (
    <Card className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-lg shadow-cyan-500/5">
      
      {/* Title */}
      <h3 className="text-xl font-semibold mb-6 
      bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Financial Health Score
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* 🔥 CIRCLE */}
        <div className="relative w-36 h-36">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            
            {/* Background */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#1f2937"
              strokeWidth="10"
            />

            {/* Progress */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={getColor(score)}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'all 0.6s ease' }}
            />
          </svg>

          {/* Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {score}
            </span>
            <span className="text-xs text-gray-400">
              out of 100
            </span>
          </div>
        </div>

        {/* 📊 DETAILS */}
        <div className="flex-1 space-y-5 w-full">
          
          {/* Status */}
          <div className="text-center md:text-left">
            <p
              className="text-lg font-semibold"
              style={{ color: getColor(score) }}
            >
              {getLabel(score)}
            </p>
          </div>

          {/* Bars */}
          {[
            { label: 'Budget Adherence', value: 85, color: 'bg-cyan-400' },
            { label: 'Savings Rate', value: 32, color: 'bg-purple-400' },
            { label: 'Category Balance', value: 92, color: 'bg-green-400' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-300">
                  {item.label}
                </span>
                <span className="text-sm text-gray-400">
                  {item.value}%
                </span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}