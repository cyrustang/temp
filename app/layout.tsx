import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SplashScreen } from '@/components/SplashScreen'
import { motion } from 'framer-motion'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Created with Next.js 14 and Shadcn UI",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SplashScreen />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <main className="p-4">
            {children}
          </main>
        </motion.div>
      </body>
    </html>
  )
}
