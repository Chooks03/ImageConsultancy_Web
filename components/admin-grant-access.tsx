"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Shield, UserPlus } from "lucide-react"
import { useAuth } from "./auth-provider"

export default function AdminGrantAccess() {
  const { user: currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchUsers = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a username or email to search.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")

    // Filter users based on search query
    const filteredUsers = allUsers.filter(
      (user: any) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setUsers(filteredUsers)
    setIsLoading(false)

    if (filteredUsers.length === 0) {
      toast({
        title: "No Users Found",
        description: "No users match your search criteria.",
      })
    }
  }

  const grantAdminAccess = (userId: string) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")

    const updatedUsers = allUsers.map((user: any) => {
      if (user.id === userId) {
        return { ...user, isAdmin: true }
      }
      return user
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update the local state
    setUsers(users.map((user) => (user.id === userId ? { ...user, isAdmin: true } : user)))

    const grantedUser = updatedUsers.find((u: any) => u.id === userId)

    toast({
      title: "Admin Access Granted",
      description: `${grantedUser.firstName} ${grantedUser.lastName} now has administrator privileges.`,
    })
  }

  const revokeAdminAccess = (userId: string) => {
    // Don't allow revoking admin from yourself
    if (userId === currentUser?.id) {
      toast({
        title: "Cannot Revoke",
        description: "You cannot revoke admin privileges from your own account.",
        variant: "destructive",
      })
      return
    }

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")

    const updatedUsers = allUsers.map((user: any) => {
      if (user.id === userId) {
        return { ...user, isAdmin: false }
      }
      return user
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update the local state
    setUsers(users.map((user) => (user.id === userId ? { ...user, isAdmin: false } : user)))

    const revokedUser = updatedUsers.find((u: any) => u.id === userId)

    toast({
      title: "Admin Access Revoked",
      description: `Admin privileges removed from ${revokedUser.firstName} ${revokedUser.lastName}.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Grant Admin Access
        </CardTitle>
        <CardDescription>Search for users and grant or revoke administrator privileges</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              placeholder="Enter username, email, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchUsers()}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={searchUsers}
              disabled={isLoading}
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {users.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Search Results:</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                      {user.id === currentUser?.id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.isAdmin ? (
                      <>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Admin</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => revokeAdminAccess(user.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                          disabled={user.id === currentUser?.id}
                        >
                          Revoke
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">User</span>
                        <Button
                          size="sm"
                          onClick={() => grantAdminAccess(user.id)}
                          className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Grant Admin
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
