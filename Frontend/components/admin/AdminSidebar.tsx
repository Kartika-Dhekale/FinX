'use client';

import Link from 'next/link';

import { usePathname, useRouter } from 'next/navigation';

import {
  LayoutDashboard,
  Users,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

const links = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Expenses',
    href: '/admin/expenses',
    icon: Receipt,
  },
  
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {

  const pathname = usePathname();

  const router = useRouter();

  const logout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    router.push('/login');
  };

  return (

    <aside className="fixed left-0 top-0 z-50 h-screen w-[260px] bg-[#0B1220] border-r border-white/10 flex flex-col justify-between p-5">

      {/* TOP */}

      <div>

        <h1 className="text-3xl font-bold text-white mb-10">

         Admin 
          

        </h1>

        <div className="space-y-3">

          {links.map((link) => {

            const Icon = link.icon;

            const active =
              pathname === link.href;

            return (

              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl p-4 transition-all ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >

                <Icon size={20} />

                <span>
                  {link.name}
                </span>

              </Link>
            );
          })}

        </div>

      </div>

      {/* BOTTOM */}

      <button
        onClick={logout}
        className="flex items-center gap-3 rounded-xl p-4 text-red-400 hover:bg-red-500/10 transition-all"
      >

        <LogOut size={20} />

        Logout

      </button>

    </aside>
  );
}