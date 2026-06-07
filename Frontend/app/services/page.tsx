'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BarChart3, TrendingUp, Brain, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <Navbar />

      {/* HERO */}
      <section className="w-full px-6 md:px-16 lg:px-24 py-40 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          Our{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Services
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Everything you need to track expenses, manage budgets, and make smarter financial decisions.
        </motion.p>
      </section>

      {/* SERVICES */}
      <section className="w-full px-6 md:px-16 lg:px-24 py-20">
        <div className="grid md:grid-cols-2 gap-10">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg hover:shadow-cyan-500/20 transition"
              >
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-cyan-400" />
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-400 mb-6">
                  {service.description}
                </p>

                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 bg-[#0F172A]">
        <div className="w-full px-6 md:px-16 lg:px-24 text-center">
          <h2 className="text-4xl font-bold mb-14">
            Simple Pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.08 }}
                className={`p-8 rounded-2xl border backdrop-blur-xl transition ${
                  plan.featured
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-transparent shadow-xl'
                    : 'bg-white/5 border-white/10 text-white'
                }`}
              >
                <h3 className="text-xl font-bold mb-3">{plan.name}</h3>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold">
                    ₹{plan.price}
                  </span>
                  <span className="ml-2 text-sm opacity-70">/month</span>
                </div>

                <ul className="space-y-3 mb-8 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full text-lg ${
                    plan.featured
                      ? 'bg-white text-black hover:scale-105'
                      : 'border border-white/20 hover:bg-white/10'
                  }`}
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-r from-cyan-500 to-purple-600">
        <h2 className="text-4xl font-bold mb-4">
          Everything Your Finances Need
        </h2>

        <p className="text-lg mb-8 opacity-90">
          Start your free trial today. No credit card required.
        </p>

        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="bg-white text-black px-8 py-6 text-lg rounded-xl">
            <Link href="/signup">Start Free Trial</Link>
          </Button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] border-t border-gray-700 py-12 text-center text-gray-400">
        <p>&copy; 2026 FinX. All rights reserved.</p>
      </footer>
    </div>
  )
}

const services = [
  {
    icon: BarChart3,
    title: 'Expense Tracking',
    description: 'Track all your expenses in one place with intelligent categorization.',
    features: [
      'Real-time expense logging',
      'Automatic categorization',
      'Receipt scanning',
      'Multi-currency support',
      'Custom categories',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Budget Management',
    description: 'Set and monitor budgets with smart alerts and recommendations.',
    features: [
      'Monthly budget planning',
      'Spending alerts',
      'Budget vs actual analysis',
      'Recurring expense tracking',
      'Financial health scoring',
    ],
  },
  {
    icon: Brain,
    title: 'AI Insights',
    description: 'Get personalized insights into your spending habits.',
    features: [
      'Pattern analysis',
      'Spending suggestions',
      'Category recommendations',
      'Savings opportunities',
      'Behavioral insights',
    ],
  },
  {
    icon: Zap,
    title: 'Predictions',
    description: 'Predict your future spending with machine learning algorithms.',
    features: [
      'Monthly forecasting',
      'Seasonal trends',
      'Anomaly detection',
      'Growth projections',
      'Trend analysis',
    ],
  },
]

const plans = [
  {
    name: 'Basic',
    price: 0,
    featured: false,
    features: [
      'Unlimited expenses',
      '3 categories',
      'Basic charts',
      'Mobile app access',
    ],
  },
  {
    name: 'Pro',
    price: 829,
    featured: true,
    features: [
      'Everything in Basic',
      'Unlimited categories',
      'Advanced analytics',
      'AI insights',
      'Budget management',
      'Email reports',
    ],
  },
  {
    name: 'Business',
    price: 2074,
    featured: false,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Priority support',
    ],
  },
]