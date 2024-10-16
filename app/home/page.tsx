import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to My Next.js App</h1>
      <Link href="/asset-management" className="text-blue-500 hover:underline">
        Go to Asset Management
      </Link>
    </div>
  )
}
