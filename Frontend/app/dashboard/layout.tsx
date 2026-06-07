'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    console.log("LAYOUT TOKEN:", token);

    if (!token) {
      router.replace('/login');
      return;
    }

    setAllowed(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Checking authentication...
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F1A] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-72 p-6 overflow-auto max-w-[1400px] mx-auto w-full">
        {children}
      </main>

    </div>
  );
}