'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState,useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 🌀 Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🎯 Nav Item
  const navItem = (path, label) => {
    const isActive = pathname === path;

    return (
      <Link
        key={path} // ✅ FIXED
        href={path}
        className={`relative font-semibold transition-all duration-300 px-1
        ${
          isActive
            ? 'text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text'
            : 'text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-500 hover:bg-clip-text'
        }
        hover:-translate-y-1 active:scale-90`}
      >
        {label}

        {/* underline */}
        <span
          className={`absolute left-0 -bottom-1 h-[3px] rounded-full transition-all duration-300
          ${
            isActive
              ? 'w-full bg-gradient-to-r from-cyan-400 to-purple-500'
              : 'w-0 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full hover:w-full'
          }`}
        ></span>
      </Link>
    );
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl transition-all duration-500
      ${
        scrolled
          ? 'bg-[#0B0F1A]/90 backdrop-blur-2xl border border-white/10 shadow-lg shadow-cyan-500/10'
          : 'bg-white/5 backdrop-blur-xl border border-white/5'
      }`}
    >
      <div className="px-6 md:px-10">

        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition duration-300">
              ⚡
            </div>

            <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              FinX
            </span>
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-10 text-lg">
            {navItem('/', 'Home')}
            {navItem('/about', 'About')}
            {navItem('/services', 'Services')}
            {navItem('/login', 'Sign In')}

            <Link
              href="/signup"
              className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:from-cyan-400 hover:to-purple-500 hover:scale-110 hover:shadow-cyan-500/40 active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition active:scale-90"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4 py-6 text-lg">

            {navItem('/', 'Home')}
            {navItem('/about', 'About')}
            {navItem('/services', 'Services')}
            {navItem('/login', 'Sign In')}

            <Link
              href="/signup"
              className="text-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 transition hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>

          </div>
        </div>

      </div>
    </nav>
  );
}