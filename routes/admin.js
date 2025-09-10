const express = require("express")
const { requireAuth, requireAdmin, users } = require("./auth")
const { appointments, services } = require("./appointments")
const router = express.Router()

// Admin dashboard
router.get("/", requireAdmin, (req, res) => {
  const totalAppointments = appointments.length
  const totalUsers = users.length
  const totalRevenue = appointments
    .filter((apt) => apt.paymentStatus === "completed")
    .reduce((sum, apt) => sum + apt.amount, 0)

  const recentAppointments = appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)

  res.render("admin/dashboard", {
    title: "Admin Dashboard - Sri Harshavardhini Image Consultancy",
    page: "admin-dashboard",
    stats: {
      totalAppointments,
      totalUsers,
      totalRevenue,
    },
    recentAppointments,
  })
})

// Admin appointments
router.get("/appointments", requireAdmin, (req, res) => {
  const allAppointments = appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.render("admin/appointments", {
    title: "Manage Appointments - Admin",
    page: "admin-appointments",
    appointments: allAppointments,
  })
})

// Admin users
router.get("/users", requireAdmin, (req, res) => {
  const allUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.render("admin/users", {
    title: "Manage Users - Admin",
    page: "admin-users",
    users: allUsers,
  })
})

// Grant admin access
router.post("/users/:id/grant-admin", requireAdmin, (req, res) => {
  const user = users.find((u) => u.id === req.params.id)

  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" })
  }

  user.isAdmin = true
  res.json({ success: true })
})

// Revoke admin access
router.post("/users/:id/revoke-admin", requireAdmin, (req, res) => {
  const user = users.find((u) => u.id === req.params.id)

  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" })
  }

  // Prevent removing admin from the main admin account
  if (user.email === "admin@sriharshavardhini.com") {
    return res.status(400).json({ success: false, error: "Cannot revoke admin access from main admin account" })
  }

  user.isAdmin = false
  res.json({ success: true })
})

// Admin settings
router.get("/settings", requireAdmin, (req, res) => {
  res.render("admin/settings", {
    title: "Admin Settings",
    page: "admin-settings",
  })
})

// Update bank details
router.post("/settings/bank-details", requireAdmin, (req, res) => {
  const { accountName, accountNumber, bankName, ifscCode, upiId } = req.body

  // In a real app, save to database
  // For now, we'll just return success
  res.json({ success: true })
})

module.exports = router
