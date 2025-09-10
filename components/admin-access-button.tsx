"use client"

import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"

export default function AdminAccessButton() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  if (!user || !isAdmin) {
    return null
  }

  return (
    <Button
      onClick={() => router.push("/admin/dashboard")}
      className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
    >
      <Shield className="w-4 h-4 mr-2" />
      Admin Dashboard
    </Button>
  )
}
