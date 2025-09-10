import { type NextRequest, NextResponse } from "next/server"
import { sendAppointmentEmails } from "@/app/actions/send-email"

// POST /api/send-appointment-email
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const result = await sendAppointmentEmails(data)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error ?? "Unknown error" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ success: false, error: "API failure" }, { status: 500 })
  }
}
