'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <Navbar />

      {/* CENTER SECTION */}
      <div className="flex items-center justify-center min-h-screen px-6">

        <div className="w-full max-w-xl">

          {/* HEADING */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              Create Account
            </h1>

            <p className="text-lg md:text-xl text-gray-400">
              Join us to start tracking your{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-semibold">
                expenses
              </span>
            </p>
          </div>

          {/* SIGNUP CARD */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 
          rounded-3xl p-10 md:p-12 shadow-2xl shadow-purple-500/10">

            <SignupForm />

            {/* FOOTER */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-base">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}