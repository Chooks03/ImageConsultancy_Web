const express = require("express")
const { body, validationResult } = require("express-validator")
const { v4: uuidv4 } = require("uuid")
const { format } = require("date-fns")
const { requireAuth } = require("./auth")
const router = express.Router()

// In-memory storage for appointments
const appointments = []

// Services data
const services = [
  {
    id: 1,
    name: "Personal Style Consultation",
    description: "Discover your unique style with our comprehensive personal consultation",
    duration: 90,
    price: 2500,
  },
  {
    id: 2,
    name: "Wardrobe Audit",
    description: "Optimize your existing wardrobe and identify key pieces",
    duration: 120,
    price: 3500,
  },
  {
    id: 3,
    name: "Color Analysis",
    description: "Find the perfect colors that complement your skin tone",
    duration: 60,
    price: 2000,
  },
  {
    id: 4,
    name: "Shopping Assistance",
    description: "Personal shopping guidance to build your perfect wardrobe",
    duration: 180,
    price: 4500,
  },
]

// Appointments page
router.get("/", requireAuth, (req, res) => {
  const userAppointments = appointments.filter((apt) => apt.userId === req.session.user.id)

  res.render("appointments/index", {
    title: "My Appointments - Sri Harshavardhini Image Consultancy",
    page: "appointments",
    appointments: userAppointments,
    services,
    success: req.query.success === "true",
  })
})

// Book appointment page
router.get("/book", requireAuth, (req, res) => {
  res.render("appointments/book", {
    title: "Book Appointment - Sri Harshavardhini Image Consultancy",
    page: "book-appointment",
    services,
  })
})

// Payment page
router.get("/payment", requireAuth, (req, res) => {
  const { serviceId, date, time } = req.query

  if (!serviceId || !date || !time) {
    return res.redirect("/appointments/book")
  }

  const service = services.find((s) => s.id === Number.parseInt(serviceId))
  if (!service) {
    return res.redirect("/appointments/book")
  }

  const appointmentDate = new Date(`${date}T${time}`)

  res.render("appointments/payment", {
    title: "Payment - Sri Harshavardhini Image Consultancy",
    page: "payment",
    service,
    appointmentDate,
    formattedDate: format(appointmentDate, "EEEE, MMMM d, yyyy"),
    formattedTime: format(appointmentDate, "h:mm a"),
  })
})

// Process payment
router.post(
  "/process-payment",
  requireAuth,
  [body("serviceId").isInt(), body("date").isISO8601(), body("paymentMethod").isIn(["card", "upi", "netbanking"])],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: "Invalid data provided" })
    }

    const { serviceId, date, paymentMethod } = req.body
    const service = services.find((s) => s.id === Number.parseInt(serviceId))

    if (!service) {
      return res.status(400).json({ success: false, error: "Service not found" })
    }

    // Generate booking ID
    const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase()

    // Create appointment after payment is confirmed
    const appointment = {
      id: uuidv4(),
      bookingId,
      userId: req.session.user.id,
      userName: `${req.session.user.firstName} ${req.session.user.lastName}`,
      userEmail: req.session.user.email,
      userPhone: req.session.user.phone,
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      amount: service.price,
      date: new Date(date),
      paymentMethod,
      paymentStatus: "completed",
      status: "confirmed",
      createdAt: new Date(),
    }

    appointments.push(appointment)

    // Send confirmation email ONLY after payment is successful and appointment is created
    try {
      const emailService = require("../services/emailService")
      await emailService.sendAppointmentConfirmation(appointment)
    } catch (error) {
      console.error("Email sending failed:", error)
    }

    res.json({ success: true, bookingId })
  },
)

// Cancel appointment
router.post("/cancel/:id", requireAuth, async (req, res) => {
  const appointmentIndex = appointments.findIndex(
    (apt) => apt.id === req.params.id && apt.userId === req.session.user.id,
  )

  if (appointmentIndex === -1) {
    return res.status(404).json({ success: false, error: "Appointment not found" })
  }

  const appointment = appointments[appointmentIndex]
  appointment.status = "cancelled"
  appointment.cancelledAt = new Date()

  // Send cancellation email
  try {
    const emailService = require("../services/emailService")
    await emailService.sendCancellationConfirmation(appointment)
  } catch (error) {
    console.error("Cancellation email failed:", error)
  }

  res.json({ success: true })
})

module.exports = { router, appointments, services }
