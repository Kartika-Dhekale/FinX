'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  LayoutDashboard,
  PlusCircle,
  BadgeIndianRupee,
  Wallet,
  PieChart,
  BrainCircuit,
  LogOut,
    Bot,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Add Expense',
      href: '/dashboard/expenses/add',
      icon: PlusCircle,
    },
    {
      title: 'Expenses',
      href: '/dashboard/expenses',
      icon: BadgeIndianRupee,
    },
    {
      title: 'Budgets',
      href: '/dashboard/budget',
      icon: Wallet,
    },
    {
      title: 'Insights',
      href: '/dashboard/insights',
      icon: PieChart,
    },
    {
      title: 'Prediction',
      href: '/dashboard/prediction',
      icon: BrainCircuit,
    },
        {
      title: 'Chatbot',
      href: '/dashboard/chat',
      icon:   Bot,
    },
  ];

  const handleLogout = () => {
    // 🔐 clear auth data (adjust based on your project)
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // redirect to login page
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#08111F] border-r border-white/10 p-6 z-50 flex flex-col">

      {/* App Name */}
      <h1 className="text-4xl font-black text-white mb-10">
        FinX
      </h1>

      {/* Menu */}
      <div className="flex flex-col gap-3 flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 border
              ${
                active
                  ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
              }`}
            >
              <Icon size={22} />
              <span className="font-semibold">{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-300"
      >
        <LogOut size={22} />
        <span className="font-semibold">Logout</span>
      </button>

    </aside>
  );
}