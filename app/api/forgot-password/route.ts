import nodemailer from "nodemailer"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 })
  }

  // Configure your SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // Send the email
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Password Reset Request",
        text: `Click the link to reset your password: http://localhost:3000/reset-password?email=${encodeURIComponent(email)}`,
    })
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 })
  }
}
