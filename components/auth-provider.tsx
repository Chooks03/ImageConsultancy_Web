"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  username: string
  isAdmin?: boolean
} | null

type AuthContextType = {
  user: User
  login: (username: string, password: string) => Promise<boolean>
  signup: (userData: any) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAdmin: boolean
  updateUserAdminStatus: (isAdminStatus: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  isLoading: true,
  isAdmin: false,
  updateUserAdminStatus: () => {},
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsAdmin(!!parsedUser.isAdmin)
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    // In a real app, this would be an API call
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user exists in localStorage (simulating a database)
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.username === username && u.password === password)

      if (foundUser) {
        // Check if user is active
        if (foundUser.isActive === false) {
          return false // Don't allow login for inactive users
        }

        const { password, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        setIsAdmin(!!userWithoutPassword.isAdmin)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (userData: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user in localStorage (simulating a database)
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if username or email already exists
      if (users.some((u: any) => u.username === userData.username || u.email === userData.email)) {
        return false
      }

      // First user is admin (in a real app, this would be more secure)
      const isFirstUser = users.length === 0

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        isAdmin: isFirstUser, // Only first user is admin
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Log the user in
      const { password, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      setIsAdmin(isFirstUser)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      // Send email notification
      sendEmailNotification(newUser)

      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem("user")
  }

  const sendEmailNotification = async (userData: any) => {
    // In a real app, this would be a server-side API call
    console.log(`Email notification would be sent to prabhushankar2626@gmail.com with user data:`, userData)
    // This would be implemented with a server action in a real application
  }

  const updateUserAdminStatus = (isAdminStatus: boolean) => {
    if (user) {
      const updatedUser = { ...user, isAdmin: isAdminStatus }
      setUser(updatedUser)
      setIsAdmin(isAdminStatus)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, isAdmin, updateUserAdminStatus }}>
      {children}
    </AuthContext.Provider>
  )
}
