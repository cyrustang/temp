import { AssetManagement } from '@/components/asset-management'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '澳門教區聖物管理系統 | Sacred Manager', // Add your desired page title here
}

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <AssetManagement />
    </div>
  )
}
