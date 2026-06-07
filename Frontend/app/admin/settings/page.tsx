'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { api } from '@/lib/api';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  Activity,
  Database,
  Users,
  FileText,
} from 'lucide-react';

export default function SettingsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showLogs, setShowLogs] = useState(false);

  // ================= LOAD DASHBOARD =================
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes || {});
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD LOGS (FIXED) =================
  const loadLogs = async () => {
  try {
    const res = await api.get('/admin/logs');

    const data = res?.data ?? res;

    console.log('LOGS RESPONSE:', data);

    setLogs(Array.isArray(data) ? data : []);

    setShowLogs(true);
  } catch (err) {
    console.error('Load logs error:', err);

    // fallback only for UI testing
    setLogs([
      { message: 'Server started successfully', time: '10:00 AM' },
      { message: 'User login detected', time: '10:05 AM' },
    ]);

    setShowLogs(true);
  }
};

  // ================= EXPORT PDF (FIXED) =================
  const exportLogsPDF = () => {
    const doc = new jsPDF();

    doc.text('System Logs Report', 14, 15);

    autoTable(doc, {
      head: [['Message', 'Time']],
      body: logs.length
        ? logs.map((l) => [l.message, l.time])
        : [['No logs available', '-']],
      startY: 25,
    });

    doc.save('logs.pdf');
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08111F] text-white flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08111F] text-white flex">

      <AdminSidebar />

      <div className="ml-[260px] w-full p-8">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-8">
          Admin Analytics Dashboard
        </h1>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Users className="text-cyan-400 mb-2" />
            <p className="text-gray-400">Total Users</p>
            <h2 className="text-3xl font-bold">
              {stats.totalUsers || 0}
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Database className="text-purple-400 mb-2" />
            <p className="text-gray-400">Total Expenses</p>
            <h2 className="text-3xl font-bold">
              {stats.totalExpenses || 0}
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Activity className="text-green-400 mb-2" />
            <p className="text-gray-400">Total Revenue</p>
            <h2 className="text-3xl font-bold">
              ₹{stats.totalAmount || 0}
            </h2>
          </div>

        </div>

        {/* SYSTEM HEALTH */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
          <h2 className="text-xl font-bold mb-4">System Health</h2>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-gray-400">Database Load</p>
              <div className="w-full bg-white/10 h-2 rounded-full">
                <div className="w-[70%] h-2 bg-cyan-400 rounded-full" />
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">API Performance</p>
              <div className="w-full bg-white/10 h-2 rounded-full">
                <div className="w-[80%] h-2 bg-green-400 rounded-full" />
              </div>
            </div>

          </div>
        </div>

        {/* LOGS SECTION */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-cyan-400" />
              System Logs
            </h2>

            <div className="flex gap-3">

              <button
                onClick={loadLogs}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                Load Logs
              </button>

              <button
                onClick={exportLogsPDF}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition"
              >
                Export PDF
              </button>

            </div>
          </div>

          {/* LOG LIST */}
          {showLogs ? (
            logs.map((l, i) => (
              <div
                key={i}
                className="p-3 mb-2 rounded-lg bg-white/5 border border-white/10"
              >
                <p className="font-medium">{l.message}</p>
                <p className="text-sm text-gray-400">{l.time}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              Click "Load Logs" to view system logs
            </p>
          )}

        </div>

      </div>
    </div>
  );
}