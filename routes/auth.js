const express = require("express")
const bcrypt = require("bcryptjs")
const { body, validationResult } = require("express-validator")
const { v4: uuidv4 } = require("uuid")
const router = express.Router()

// In-memory storage (replace with database in production)
const users = [
  {
    id: "1",
    email: "admin@sriharshavardhini.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    firstName: "Admin",
    lastName: "User",
    phone: "+91 7826071703",
    isAdmin: true,
    createdAt: new Date(),
  },
]

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login")
  }
  next()
}

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).render("error", {
      title: "Access Denied",
      message: "You do not have permission to access this page.",
    })
  }
  next()
}

// Login page
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/")
  }
  res.render("auth/login", {
    title: "Login - Sri Harshavardhini Image Consultancy",
    page: "login",
    error: null,
  })
})

// Login POST
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("auth/login", {
        title: "Login - Sri Harshavardhini Image Consultancy",
        page: "login",
        error: "Please provide valid email and password",
      })
    }

    const { email, password } = req.body
    const user = users.find((u) => u.email === email)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("auth/login", {
        title: "Login - Sri Harshavardhini Image Consultancy",
        page: "login",
        error: "Invalid email or password",
      })
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isAdmin: user.isAdmin,
    }

    res.redirect("/")
  },
)

// Signup page
router.get("/signup", (req, res) => {
  if (req.session.user) {
    return res.redirect("/")
  }
  res.render("auth/signup", {
    title: "Sign Up - Sri Harshavardhini Image Consultancy",
    page: "signup",
    error: null,
  })
})

// Signup POST
router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").trim().isLength({ min: 2 }),
    body("lastName").trim().isLength({ min: 2 }),
    body("phone").isMobilePhone("en-IN"),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render("auth/signup", {
        title: "Sign Up - Sri Harshavardhini Image Consultancy",
        page: "signup",
        error: "Please provide valid information",
      })
    }

    const { email, password, firstName, lastName, phone } = req.body

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return res.render("auth/signup", {
        title: "Sign Up - Sri Harshavardhini Image Consultancy",
        page: "signup",
        error: "User with this email already exists",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      isAdmin: false,
      createdAt: new Date(),
    }

    users.push(newUser)

    // Auto login
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      isAdmin: newUser.isAdmin,
    }

    res.redirect("/")
  },
)

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err)
    }
    res.redirect("/")
  })
})

// Forgot password page
router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password", {
    title: "Forgot Password - Sri Harshavardhini Image Consultancy",
    page: "forgot-password",
    message: null,
  })
})

// Forgot password POST
router.post("/forgot-password", [body("email").isEmail().normalizeEmail()], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("auth/forgot-password", {
      title: "Forgot Password - Sri Harshavardhini Image Consultancy",
      page: "forgot-password",
      message: "Please provide a valid email address",
    })
  }

  // In a real app, you would send a password reset email
  res.render("auth/forgot-password", {
    title: "Forgot Password - Sri Harshavardhini Image Consultancy",
    page: "forgot-password",
    message: "If an account with that email exists, we have sent a password reset link.",
  })
})

module.exports = { router, requireAuth, requireAdmin, users }
