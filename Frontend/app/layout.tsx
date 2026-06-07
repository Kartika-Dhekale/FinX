import type { Metadata } from 'next'
import { Inter } from "next/font/google"
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

import './globals.css'

// ✅ Use stable font (Inter)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

// ✅ Metadata
export const metadata: Metadata = {
  title: 'Smart Expense Tracker',
  description: 'Track expenses, manage budgets, and get AI-powered insights',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

// ✅ Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          font-sans antialiased
          bg-[#0B0F1A] text-white
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {/* 🔥 Main App */}
          <div className="min-h-screen w-full">
            {children}
          </div>

          {/* 🔔 Toast Notifications */}
          <Toaster richColors position="top-right" />
        </ThemeProvider>

        {/* 📊 Analytics (only production) */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}