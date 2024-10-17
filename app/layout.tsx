import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from 'next/link'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "澳門教區資聖物管理系統 | Sacred Manager", // Change this to your desired title
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
        <nav className="bg-primary text-primary-foreground p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Sacred Manager</Link>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Home</Link>
              {/* Remove or comment out the Asset Management link */}
              {/* <Link href="/asset-management" className="hover:underline">Asset Management</Link> */}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4 mt-8">
          {children}
        </main>
      </body>
    </html>
  )
}
