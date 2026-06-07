'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Users,
  Receipt,
  Wallet,
  TrendingUp,
  Activity,
  ShieldCheck,
  BarChart3,
  Sparkles,
  AlertTriangle,
  PieChart,
  UserRound,
} from 'lucide-react';

import AdminSidebar from '@/components/admin/AdminSidebar';

import { api } from '@/lib/api';

type StatsType = {
  totalUsers: number;
  totalExpenses: number;
  totalAmount: number;
  monthlyExpenses: number;
};

type TopUserType = {
  name: string;
  totalSpent: number;
  expenseCount: number;
};

type ActivityType = {
  message: string;
};

type FraudType = {
  amount: number;
  category: string;
};

type CategoryType = {
  _id: string;
  total: number;
};

type GrowthType = {
  dailyUsers: number;
  weeklyUsers: number;
  totalUsers: number;
};

export default function AdminDashboard() {

  const router = useRouter();

  // ================= STATES =================

  const [stats, setStats] =
    useState<StatsType>({
      totalUsers: 0,
      totalExpenses: 0,
      totalAmount: 0,
      monthlyExpenses: 0,
    });

  const [topUsers, setTopUsers] =
    useState<TopUserType[]>([]);

  const [activities, setActivities] =
    useState<ActivityType[]>([]);

  const [fraudAlerts, setFraudAlerts] =
    useState<FraudType[]>([]);

  const [categories, setCategories] =
    useState<CategoryType[]>([]);

  const [growth, setGrowth] =
    useState<GrowthType>({
      dailyUsers: 0,
      weeklyUsers: 0,
      totalUsers: 0,
    });

  const [loading, setLoading] =
    useState(true);

  // ================= AUTH CHECK =================

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    loadDashboardData();

  }, []);

  // ================= LOAD DATA =================

  const loadDashboardData = async () => {

    try {

      setLoading(true);

      // ================= STATS =================

      const statsData =
        await api.get('/admin/stats');

      setStats(statsData);

      // ================= TOP USERS =================

      const usersData =
        await api.get('/admin/top-users');

      setTopUsers(usersData || []);

      // ================= ACTIVITIES =================

      const activityData =
        await api.get('/admin/activities');

      setActivities(activityData || []);

      // ================= FRAUD =================

      const fraudData =
        await api.get('/admin/fraud-alerts');

      setFraudAlerts(fraudData || []);

      // ================= CATEGORIES =================

      const categoryData =
        await api.get('/admin/categories');

      setCategories(categoryData || []);

      // ================= GROWTH =================

      const growthData =
        await api.get('/admin/growth');

      setGrowth(growthData);

    } catch (error) {

      console.error(
        'Dashboard Error:',
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#08111F] flex items-center justify-center">

        <div className="text-3xl font-bold text-white animate-pulse">
          Loading Dashboard...
        </div>

      </div>
    );
  }

  // ================= TOTAL CATEGORY =================

  const totalCategoryAmount =
    categories.reduce(
      (acc, item) => acc + item.total,
      0
    );

  // ================= COLORS =================

  const colors = [
    '#06B6D4',
    '#A855F7',
    '#EC4899',
    '#22C55E',
    '#F97316',
  ];

  // ================= UI =================

  return (

    <div className="min-h-screen bg-[#08111F] text-white flex overflow-hidden">

      {/* SIDEBAR */}

      <AdminSidebar />

      {/* MAIN */}

      <div className="ml-[260px] w-full">

        {/* TOPBAR */}

        <div className="sticky top-0 z-40 border-b border-white/10 bg-[#08111F]/90 backdrop-blur-xl">

          <div className="px-8 py-5 flex items-center justify-between">

            <div>

              <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>

              <p className="text-gray-400 mt-2">
                Advanced analytics and monitoring system
              </p>

            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10">

              <ShieldCheck className="text-cyan-400" />

              <span className="font-semibold">
                Secure Platform
              </span>

            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="p-8">

          {/* HERO */}

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-10 shadow-2xl">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

              <div className="max-w-3xl">

                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-cyan-300 mb-6">

                  <Sparkles size={18} />

                  Platform Analytics

                </div>

                <h2 className="text-6xl font-black leading-tight">

                  Welcome Back

                  <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Super Admin
                  </span>

                </h2>

                <p className="text-gray-300 text-lg mt-6 leading-relaxed">
                  Monitor users, expenses, revenue,
                  fraud detection and analytics.
                </p>

              </div>

              {/* STATS */}

              <div className="grid grid-cols-2 gap-5">

                {/* USERS */}

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-gray-400 text-sm">
                        Users
                      </p>

                      <h3 className="text-4xl font-black mt-3">
                        {stats.totalUsers}
                      </h3>

                    </div>

                    <div className="p-4 rounded-2xl bg-cyan-500/20">

                      <Users className="text-cyan-400" />

                    </div>

                  </div>

                </div>

                {/* EXPENSES */}

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-gray-400 text-sm">
                        Expenses
                      </p>

                      <h3 className="text-4xl font-black mt-3">
                        {stats.totalExpenses}
                      </h3>

                    </div>

                    <div className="p-4 rounded-2xl bg-purple-500/20">

                      <Receipt className="text-purple-400" />

                    </div>

                  </div>

                </div>

                {/* REVENUE */}

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-gray-400 text-sm">
                        Revenue
                      </p>

                      <h3 className="text-4xl font-black mt-3">
                        ₹ {stats.totalAmount}
                      </h3>

                    </div>

                    <div className="p-4 rounded-2xl bg-green-500/20">

                      <Wallet className="text-green-400" />

                    </div>

                  </div>

                </div>

                {/* MONTHLY */}

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-gray-400 text-sm">
                        Monthly
                      </p>

                      <h3 className="text-4xl font-black mt-3">
                        ₹ {stats.monthlyExpenses}
                      </h3>

                    </div>

                    <div className="p-4 rounded-2xl bg-orange-500/20">

                      <TrendingUp className="text-orange-400" />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* GROWTH + CATEGORY */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">

            {/* GROWTH */}

            <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8">

              <div className="flex items-center gap-3 mb-8">

                <BarChart3 className="text-cyan-400" />

                <h2 className="text-3xl font-bold">
                  User Growth Analytics
                </h2>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="rounded-2xl bg-cyan-500/10 p-6">

                  <p className="text-gray-400">
                    Daily Users
                  </p>

                  <h3 className="text-5xl font-black text-cyan-400 mt-4">
                    +{growth.dailyUsers}
                  </h3>

                </div>

                <div className="rounded-2xl bg-purple-500/10 p-6">

                  <p className="text-gray-400">
                    Weekly Users
                  </p>

                  <h3 className="text-5xl font-black text-purple-400 mt-4">
                    +{growth.weeklyUsers}
                  </h3>

                </div>

                <div className="rounded-2xl bg-green-500/10 p-6">

                  <p className="text-gray-400">
                    Total Users
                  </p>

                  <h3 className="text-5xl font-black text-green-400 mt-4">
                    {growth.totalUsers}
                  </h3>

                </div>

              </div>

            </div>

            {/* CATEGORY */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

              <div className="flex items-center gap-3 mb-8">

                <PieChart className="text-pink-400" />

                <h2 className="text-3xl font-bold">
                  Categories
                </h2>

              </div>

              <div className="space-y-6">

                {categories.map((item, index) => {

                  const percentage =
                    totalCategoryAmount > 0
                      ? Math.round(
                          (item.total /
                            totalCategoryAmount) *
                            100
                        )
                      : 0;

                  return (

                    <div key={index}>

                      <div className="flex justify-between mb-2">

                        <span>{item._id}</span>

                        <span>{percentage}%</span>

                      </div>

                      <div className="h-3 rounded-full bg-white/10 overflow-hidden">

                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor:
                              colors[index % colors.length],
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

          {/* TOP USERS + ACTIVITY */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

            {/* USERS */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

              <div className="flex items-center gap-3 mb-8">

                <UserRound className="text-cyan-400" />

                <h2 className="text-3xl font-bold">
                  Top Spending Users
                </h2>

              </div>

              <div className="space-y-5">

                {topUsers.map((user, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
                  >

                    <div>

                      <h3 className="font-semibold text-lg">
                        {user.name}
                      </h3>

                      <p className="text-gray-400 text-sm mt-1">
                        {user.expenseCount} expenses
                      </p>

                    </div>

                    <p className="text-2xl font-black text-green-400">
                      ₹ {user.totalSpent}
                    </p>

                  </div>

                ))}

              </div>

            </div>

            {/* ACTIVITY */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

              <div className="flex items-center gap-3 mb-8">

                <Activity className="text-orange-400" />

                <h2 className="text-3xl font-bold">
                  Real-Time Feed
                </h2>

              </div>

              <div className="space-y-5">

                {activities.map((activity, index) => (

                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    {activity.message}
                  </div>

                ))}

              </div>

            </div>

          </div>

         

          </div>

        </div>

      </div>

  
  );
}