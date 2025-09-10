# Sri Harshavardhini Image Consultancy Website

A complete Node.js web application for Sri Harshavardhini Image Consultancy Service, built with Express.js, EJS templating, and comprehensive email functionality.

## 🚀 Features

### User Features
- **User Authentication**: Secure registration, login, and session management
- **Service Booking**: Interactive appointment booking system with multiple services
- **Payment Processing**: Multiple payment methods (Card, UPI, Net Banking)
- **Email Notifications**: Professional HTML emails for confirmations and cancellations
- **Responsive Design**: Mobile-friendly interface with modern UI

### Admin Features
- **Admin Dashboard**: Complete overview of appointments, users, and revenue
- **User Management**: Grant/revoke admin access, view user details
- **Appointment Management**: View and manage all appointments
- **Settings Panel**: Configure bank details and system settings

### Technical Features
- **Express.js Backend**: RESTful API with proper routing and middleware
- **EJS Templating**: Server-side rendering with dynamic content
- **Session Management**: Secure user sessions with express-session
- **Email Service**: Nodemailer integration with Gmail support
- **Input Validation**: Server-side validation with express-validator
- **Security**: Password hashing with bcrypt, CSRF protection

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gmail account (for email functionality)

## 🛠 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd sri-harshavardhini-website
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Edit `.env` file with your configuration:
   \`\`\`env
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your-super-secret-session-key-here
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASS=your-gmail-app-password
   \`\`\`

4. **Gmail Setup** (for email functionality)
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password: Google Account → Security → App passwords
   - Use the generated password in `EMAIL_PASS`

## 🚀 Running the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`

### Production Mode
\`\`\`bash
npm start
\`\`\`

The application will be available at `http://localhost:3000`

## 👤 Default Admin Account

- **Email**: `admin@sriharshavardhini.com`
- **Password**: `password`

## 📁 Project Structure

\`\`\`
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── appointments.js  # Appointment booking routes
│   ├── admin.js         # Admin panel routes
│   └── email.js         # Email API routes
├── services/
│   └── emailService.js  # Email service with HTML templates
├── views/
│   ├── layout.ejs       # Main layout template
│   ├── index.ejs        # Homepage
│   ├── auth/            # Authentication pages
│   ├── appointments/    # Appointment pages
│   └── admin/           # Admin panel pages
├── public/              # Static assets
├── server.js            # Main application file
└── package.json         # Dependencies and scripts
\`\`\`

## 🎨 Services Offered

1. **Personal Style Consultation** (90 mins) - ₹2,500
2. **Wardrobe Audit** (120 mins) - ₹3,500
3. **Color Analysis** (60 mins) - ₹2,000
4. **Shopping Assistance** (180 mins) - ₹4,500

## 📧 Email Features

### Development Mode
- Emails are logged to console for testing
- No actual emails are sent

### Production Mode
- Professional HTML email templates
- Appointment confirmations sent to clients
- Business notifications sent to admin
- Cancellation confirmations

## 🔐 Security Features

- Password hashing with bcrypt
- Session-based authentication
- Input validation and sanitization
- CSRF protection for forms
- Secure cookie configuration

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git:
   \`\`\`bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   \`\`\`

### DigitalOcean/AWS Deployment
1. Set up a server with Node.js
2. Clone the repository
3. Install dependencies
4. Configure environment variables
5. Use PM2 for process management:
   \`\`\`bash
   npm install -g pm2
   pm2 start server.js --name "sri-harshavardhini"
   \`\`\`

## 🔧 Configuration

### Email Configuration
- Set `EMAIL_USER` to your Gmail address
- Set `EMAIL_PASS` to your Gmail App Password
- Business emails are sent to `prabhushankar2626@gmail.com`

### Session Configuration
- Change `SESSION_SECRET` to a secure random string
- Configure session timeout in `server.js`

## 📱 API Endpoints

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/signup` - Registration page
- `POST /auth/signup` - Process registration
- `POST /auth/logout` - Logout user

### Appointments
- `GET /appointments` - User appointments
- `GET /appointments/book` - Booking page
- `GET /appointments/payment` - Payment page
- `POST /appointments/process-payment` - Process payment
- `POST /appointments/cancel/:id` - Cancel appointment

### Admin
- `GET /admin` - Admin dashboard
- `GET /admin/appointments` - Manage appointments
- `GET /admin/users` - Manage users
- `POST /admin/users/:id/grant-admin` - Grant admin access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, contact:
- **Email**: prabhushankar2626@gmail.com
- **Phone**: +91 7826071703
- **Instagram**: @imageconsultant_harsha

## 🙏 Acknowledgments

- Built with Express.js and EJS
- Styled with Tailwind CSS
- Icons by Font Awesome
- Email service by Nodemailer
