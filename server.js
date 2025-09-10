const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const path = require("path")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const appointmentRoutes = require("./routes/appointments")
const adminRoutes = require("./routes/admin")
const emailRoutes = require("./routes/email")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sri-harshavardhini-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

// View engine setup
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Global middleware to pass user to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  res.locals.isAdmin = req.session.user?.isAdmin || false
  next()
})

// Routes
app.use("/auth", authRoutes)
app.use("/appointments", appointmentRoutes)
app.use("/admin", adminRoutes)
app.use("/api", emailRoutes)

// Home route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Sri Harshavardhini Image Consultancy Service",
    page: "home",
  })
})

// About route
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us - Sri Harshavardhini Image Consultancy",
    page: "about",
  })
})

// Contact route
app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us - Sri Harshavardhini Image Consultancy",
    page: "contact",
  })
})

// Services route
app.get("/services", (req, res) => {
  const services = [
    {
      id: 1,
      name: "Personal Style Consultation",
      description: "Discover your unique style with our comprehensive personal consultation",
      duration: 90,
      price: 2500,
      image: "/images/personal-style.jpg",
    },
    {
      id: 2,
      name: "Wardrobe Audit",
      description: "Optimize your existing wardrobe and identify key pieces",
      duration: 120,
      price: 3500,
      image: "/images/wardrobe-audit.jpg",
    },
    {
      id: 3,
      name: "Color Analysis",
      description: "Find the perfect colors that complement your skin tone",
      duration: 60,
      price: 2000,
      image: "/images/color-analysis.jpg",
    },
    {
      id: 4,
      name: "Shopping Assistance",
      description: "Personal shopping guidance to build your perfect wardrobe",
      duration: 180,
      price: 4500,
      image: "/images/shopping-assistance.jpg",
    },
  ]

  res.render("services", {
    title: "Our Services - Sri Harshavardhini Image Consultancy",
    page: "services",
    services,
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error", {
    title: "Error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
    message: "The page you are looking for does not exist.",
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Sri Harshavardhini website running on http://localhost:${PORT}`)
})
