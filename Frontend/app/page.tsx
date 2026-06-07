'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Brain,
  Zap,
  Lock,
  Users,
} from 'lucide-react'
import AnimatedWrapper from '@/components/AnimatedWrapper'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white overflow-hidden">
      <Navbar />

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] top-[-100px] left-[-100px]" />
        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] bottom-[-100px] right-[-100px]" />
      </div>

      {/* HERO */}
      <section className="w-full px-6 md:px-16 lg:px-24 py-28">
        <AnimatedWrapper>
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                Master Your{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                  Finances
                </span>{' '}
                with Smart Insights
              </h1>

              <p className="text-lg text-gray-400 mb-10">
                Track expenses, manage budgets, and make better financial decisions.
              </p>

              <div className="flex gap-4">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-6 text-lg rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20">
                    Get Started <ArrowRight className="ml-2 inline" />
                  </Button>
                </Link>

                <Link href="/about">
                  <Button
                    variant="outline"
                    className="px-6 py-6 text-lg border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl rounded-3xl group-hover:scale-110 transition" />

              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl hover:scale-105 transition">
                <div className="space-y-5">

                  <div className="flex justify-between p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-400">Monthly Spending</span>
                    <span className="text-2xl text-cyan-400 font-bold">₹2,450</span>
                  </div>

                  <div className="flex justify-between p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-400">Budget Remaining</span>
                    <span className="text-2xl text-orange-400 font-bold">₹550</span>
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <p className="text-purple-400 text-sm font-semibold">AI Insight</p>
                    <p className="text-gray-300 mt-2">
                      You're 82% of your monthly budget. Reduce dining expenses.
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </AnimatedWrapper>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features
          </h2>

          <p className="text-gray-400 text-lg mb-16">
            Everything you need to take control of your finances
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="p-8 bg-[#111827] rounded-2xl border border-gray-700 flex flex-col items-center text-center hover:border-cyan-400 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-cyan-400" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">

          <div className="bg-[#111827] p-8 rounded-2xl border border-gray-700 hover:scale-105 transition">
            <div className="text-4xl font-bold text-cyan-400 mb-2">500K+</div>
            <p className="text-gray-400">Active Users</p>
          </div>

          <div className="bg-[#111827] p-8 rounded-2xl border border-gray-700 hover:scale-105 transition">
            <div className="text-4xl font-bold text-purple-400 mb-2">₹83,000Cr+</div>
            <p className="text-gray-400">Money Tracked</p>
          </div>

          <div className="bg-[#111827] p-8 rounded-2xl border border-gray-700 hover:scale-105 transition">
            <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
            <p className="text-gray-400">User Satisfaction</p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-purple-600 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Transform Your Finances?
        </h2>

        <p className="text-lg mb-8 opacity-90">
          Join thousands of users making smarter financial decisions.
        </p>

        <Link href="/signup">
          <Button className="bg-white text-black px-8 py-6 text-lg rounded-xl hover:scale-105 transition">
            Start Free Trial <ArrowRight className="ml-2 inline" />
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] border-t border-gray-700 py-12 text-center text-gray-400">
        <p>&copy; 2026 FinX. All rights reserved.</p>
      </footer>
    </div>
  )
}

/* FEATURES DATA */
const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Tracking',
    description: 'Monitor expenses with detailed category breakdowns.',
  },
  {
    icon: TrendingUp,
    title: 'Smart Budget Planning',
    description: 'Set budgets and get alerts instantly.',
  },
  {
    icon: Brain,
    title: 'AI Insights',
    description: 'Get intelligent spending suggestions.',
  },
  {
    icon: Zap,
    title: 'Spending Predictions',
    description: 'Predict future expenses using AI.',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Encrypted financial data protection.',
  },
  {
    icon: Users,
    title: 'Easy Sharing',
    description: 'Share reports securely.',
  },
]