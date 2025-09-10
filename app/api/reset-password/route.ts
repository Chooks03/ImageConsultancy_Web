import type { NextRequest } from "next/server"

// Replace with your actual user database logic
const users: { email: string; password: string }[] = []

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 })
  }
  if (password.length < 6) {
    return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), { status: 400 })
  }

  // Find user and update password (replace with real DB logic)
  const user = users.find((u) => u.email === email)
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
  }
  user.password = password

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
