const express = require("express")
const { body, validationResult } = require("express-validator")
const emailService = require("../services/emailService")
const router = express.Router()

// Send appointment email
router.post("/send-appointment-email", async (req, res) => {
  try {
    const { appointmentData } = req.body

    if (!appointmentData) {
      return res.status(400).json({ success: false, error: "Appointment data is required" })
    }

    const result = await emailService.sendAppointmentConfirmation(appointmentData)
    res.json(result)
  } catch (error) {
    console.error("Email API error:", error)
    res.status(500).json({ success: false, error: "Failed to send email" })
  }
})

// Send contact form email
router.post(
  "/send-contact-email",
  [
    body("name").trim().isLength({ min: 2 }),
    body("email").isEmail().normalizeEmail(),
    body("message").trim().isLength({ min: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: "Invalid form data" })
    }

    try {
      const { name, email, phone, message } = req.body

      // Send contact form email
      const result = await emailService.sendContactFormEmail({
        name,
        email,
        phone,
        message,
      })

      res.json(result)
    } catch (error) {
      console.error("Contact email error:", error)
      res.status(500).json({ success: false, error: "Failed to send contact email" })
    }
  },
)

module.exports = router
