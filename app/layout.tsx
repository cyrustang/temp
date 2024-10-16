import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from 'next/link'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Created with Next.js 14 and Shadcn UI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-100 p-4">
          <Link href="/" className="mr-4 hover:underline">Home</Link>
        </nav>
        <main className="p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
