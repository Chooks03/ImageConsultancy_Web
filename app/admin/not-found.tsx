import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Admin Page Not Found</h2>
        <p className="text-gray-600 mb-8">The admin page you're looking for doesn't exist or you don't have access.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/admin/settings">Admin Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Website</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
