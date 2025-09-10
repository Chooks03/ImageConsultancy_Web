const nodemailer = require("nodemailer")
const { format } = require("date-fns")

// Create transporter
const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  // For development - log emails to console
  return {
    sendMail: async (mailOptions) => {
      console.log("=== EMAIL SENT ===")
      console.log("To:", mailOptions.to)
      console.log("Subject:", mailOptions.subject)
      console.log("HTML:", mailOptions.html)
      console.log("==================")
      return { messageId: "dev-" + Date.now() }
    },
  }
}

const sendAppointmentConfirmation = async (appointmentData) => {
  try {
    const transporter = createTransporter()

    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f43f5e, #a855f7); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Sri Harshavardhini Image Consultancy</h1>
          <p style="color: white; margin: 5px 0 0 0;">Appointment Confirmation</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Dear ${appointmentData.userName},</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for booking an appointment with Sri Harshavardhini Image Consultancy Service!
            We're excited to help you transform your style.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f43f5e;">
            <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Booking ID:</td><td>${appointmentData.bookingId}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td>${appointmentData.serviceName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Duration:</td><td>${appointmentData.duration} minutes</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Date:</td><td>${format(new Date(appointmentData.date), "EEEE, MMMM d, yyyy")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Time:</td><td>${format(new Date(appointmentData.date), "h:mm a")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Amount Paid:</td><td>₹${appointmentData.amount}</td></tr>
            </table>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Consultant Details</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> Sriharshavardhini Manikandan</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> +91 7826071703</p>
            <p style="margin: 5px 0;"><strong>Studio Address:</strong> 55C Velayutham Rd, Sivakasi, Tamil Nadu - 626123</p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            We look forward to helping you discover your unique style and boost your confidence!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.instagram.com/imageconsultant_harsha" 
               style="background: linear-gradient(135deg, #f43f5e, #a855f7); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Follow us on Instagram
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Best regards,<br>
            Sri Harshavardhini Image Consultancy Service
          </p>
        </div>
      </div>
    `

    const businessEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f43f5e, #a855f7); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Appointment Booking</h1>
          <p style="color: white; margin: 5px 0 0 0;">Client Booking Notification</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">New Appointment Received!</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin-top: 0;">Client Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${appointmentData.userName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${appointmentData.userEmail}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${appointmentData.userPhone}</td></tr>
            </table>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f43f5e;">
            <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Booking ID:</td><td>${appointmentData.bookingId}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td>${appointmentData.serviceName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Duration:</td><td>${appointmentData.duration} minutes</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Date:</td><td>${format(new Date(appointmentData.date), "EEEE, MMMM d, yyyy")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Time:</td><td>${format(new Date(appointmentData.date), "h:mm a")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Amount:</td><td>₹${appointmentData.amount}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Payment Method:</td><td>${appointmentData.paymentMethod}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Payment Status:</td><td>${appointmentData.paymentStatus}</td></tr>
            </table>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Please prepare for the consultation accordingly and ensure all materials are ready.
          </p>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>Reminder:</strong> Contact the client 24 hours before the appointment to confirm attendance.
            </p>
          </div>
        </div>
      </div>
    `

    // Send email to client
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "noreply@sriharshavardhini.com",
      to: appointmentData.userEmail,
      subject: "Appointment Confirmation - Sri Harshavardhini Image Consultancy",
      html: clientEmailHtml,
    })

    // Send email to business
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "noreply@sriharshavardhini.com",
      to: "prabhushankar2626@gmail.com",
      subject: "New Appointment Booking - Sri Harshavardhini Image Consultancy",
      html: businessEmailHtml,
    })

    return { success: true }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: error.message }
  }
}

const sendCancellationConfirmation = async (appointmentData) => {
  try {
    const transporter = createTransporter()

    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Sri Harshavardhini Image Consultancy</h1>
          <p style="color: white; margin: 5px 0 0 0;">Appointment Cancellation</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Dear ${appointmentData.userName},</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Your appointment with Sri Harshavardhini Image Consultancy Service has been successfully cancelled.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #1f2937; margin-top: 0;">Cancelled Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Booking ID:</td><td>${appointmentData.bookingId}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td>${appointmentData.serviceName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Duration:</td><td>${appointmentData.duration} minutes</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Original Date:</td><td>${format(new Date(appointmentData.date), "EEEE, MMMM d, yyyy")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Original Time:</td><td>${format(new Date(appointmentData.date), "h:mm a")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Amount:</td><td>₹${appointmentData.amount}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Cancelled on:</td><td>${format(new Date(appointmentData.cancelledAt), "EEEE, MMMM d, yyyy")}</td></tr>
            </table>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            If you need to reschedule or book a new appointment, please visit our website or contact us directly.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Contact Information</h3>
            <p style="margin: 5px 0;"><strong>Consultant:</strong> Sriharshavardhini Manikandan</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> +91 7826071703</p>
            <p style="margin: 5px 0;"><strong>Studio Address:</strong> 55C Velayutham Rd, Sivakasi, Tamil Nadu - 626123</p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            We hope to serve you again soon!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.instagram.com/imageconsultant_harsha" 
               style="background: linear-gradient(135deg, #f43f5e, #a855f7); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Follow us on Instagram
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Best regards,<br>
            Sri Harshavardhini Image Consultancy Service
          </p>
        </div>
      </div>
    `

    // Send email to client
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "noreply@sriharshavardhini.com",
      to: appointmentData.userEmail,
      subject: "Appointment Cancellation Confirmation - Sri Harshavardhini Image Consultancy",
      html: clientEmailHtml,
    })

    // Send email to business
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "noreply@sriharshavardhini.com",
      to: "prabhushankar2626@gmail.com",
      subject: "Appointment Cancellation Notice - Sri Harshavardhini Image Consultancy",
      html: `<p>Appointment ${appointmentData.bookingId} has been cancelled by ${appointmentData.userName}</p>`,
    })

    return { success: true }
  } catch (error) {
    console.error("Cancellation email failed:", error)
    return { success: false, error: error.message }
  }
}

const sendContactFormEmail = async (contactData) => {
  try {
    const transporter = createTransporter()

    const contactEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f43f5e, #a855f7); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          <p style="color: white; margin: 5px 0 0 0;">Sri Harshavardhini Image Consultancy</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">New Contact Form Message</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin-top: 0;">Contact Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${contactData.name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${contactData.email}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${contactData.phone || "Not provided"}</td></tr>
            </table>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f43f5e;">
            <h3 style="color: #1f2937; margin-top: 0;">Message</h3>
            <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${contactData.message}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Please respond to this inquiry as soon as possible.
          </p>
        </div>
      </div>
    `

    // Send email to business
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "noreply@sriharshavardhini.com",
      to: "prabhushankar2626@gmail.com",
      subject: `New Contact Form Submission from ${contactData.name}`,
      html: contactEmailHtml,
      replyTo: contactData.email,
    })

    return { success: true }
  } catch (error) {
    console.error("Contact email failed:", error)
    return { success: false, error: error.message }
  }
}

module.exports = {
  sendAppointmentConfirmation,
  sendCancellationConfirmation,
  sendContactFormEmail,
}
