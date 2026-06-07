"use client"

import { motion } from "framer-motion"
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, Sparkles, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden">
      <Navbar />

      {/* 🌌 BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] top-[-100px] left-[-100px]" />
        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] bottom-[-100px] right-[-100px]" />
      </div>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight"
        >
          About{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            ExpenseTrack
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          Take control of your finances with AI-powered insights, real-time tracking,
          and smarter money decisions.
        </motion.p>
      </section>

      {/* 🧠 OUR STORY (IMPROVED) */}
      <section className="py-28 border-y border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Our Story
            </h2>

            <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
              <p>
                ExpenseTrack started with a simple idea — money management should be
                effortless, not overwhelming. We were tired of complex apps that made
                tracking finances harder instead of easier.
              </p>

              <p>
                So we built something different — a clean, intelligent platform that
                combines simplicity with powerful AI insights.
              </p>

              <p>
                Today, thousands of users trust ExpenseTrack to understand their
                spending, optimize budgets, and achieve financial freedom.
              </p>
            </div>
          </motion.div>

          {/* VISUAL CARD */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl hover:scale-105 transition"
          >
            <h3 className="text-2xl font-semibold mb-6 text-cyan-400">
              Our Mission
            </h3>

            <p className="text-gray-300 leading-relaxed">
              To empower individuals with intelligent financial tools that simplify
              money management and unlock smarter decisions through AI.
            </p>
          </motion.div>

        </div>
      </section>

      {/* 💎 VALUES */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ scale: 1.08 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl 
              shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="mb-6 text-cyan-400">
                {value.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {value.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 CTA */}
      <section className="py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Take Control?
          </h2>

          <p className="text-xl mb-10 text-gray-400">
            Join thousands improving their financial future.
          </p>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="text-lg px-10 py-6 bg-gradient-to-r from-cyan-500 to-purple-500 border-0 shadow-lg hover:shadow-cyan-500/30"
              asChild
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] border-t border-gray-700 py-12 text-center text-gray-400">
        <p>&copy; 2026 FinX. All rights reserved.</p>
      </footer>
    </div>
  )
}

const values = [
  {
    title: 'Simplicity',
    description:
      'We design intuitive experiences that make managing finances effortless.',
    icon: <Zap size={30} />
  },
  {
    title: 'Security',
    description:
      'We protect your data with advanced encryption and industry standards.',
    icon: <Shield size={30} />
  },
  {
    title: 'Innovation',
    description:
      'We leverage AI to deliver smarter insights and better financial decisions.',
    icon: <Sparkles size={30} />
  },
]