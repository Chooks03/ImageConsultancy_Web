"use server"

import nodemailer from "nodemailer"

// Real email service using Nodemailer
async function sendEmail(to: string[], subject: string, content: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to.join(','),
    subject: subject,
    html: content
  });

  return { success: true }
}

export async function sendAppointmentEmails(bookingData: any) {
  const clientEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f43f5e, #a855f7); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Sri Harshavardhini Image Consultancy</h1>
        <p style="color: white; margin: 5px 0 0 0;">Appointment Confirmation</p>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Dear ${bookingData.clientName},</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Thank you for booking an appointment with Sri Harshavardhini Image Consultancy Service!
          We're excited to help you transform your style.
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f43f5e;">
          <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Booking ID:</td><td>${bookingData.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td>${bookingData.serviceName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Duration:</td><td>${bookingData.duration} minutes</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Date:</td><td>${bookingData.date}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Time:</td><td>${bookingData.time}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Amount Paid:</td><td>₹${bookingData.amount}</td></tr>
          </table>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Consultant Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${bookingData.consultantName}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${bookingData.consultantPhone}</p>
          <p style="margin: 5px 0;"><strong>Studio Address:</strong> ${bookingData.studioAddress}</p>
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

  const businessEmailContent = `
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
            <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${bookingData.clientName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${bookingData.clientEmail}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${bookingData.clientPhone}</td></tr>
          </table>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f43f5e;">
          <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Booking ID:</td><td>${bookingData.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td>${bookingData.serviceName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Duration:</td><td>${bookingData.duration} minutes</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Date:</td><td>${bookingData.date}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Time:</td><td>${bookingData.time}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Amount:</td><td>₹${bookingData.amount}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Payment Method:</td><td>${bookingData.paymentMethod}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Payment Status:</td><td>${bookingData.paymentStatus}</td></tr>
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

  try {
    // Send email to client
    await sendEmail(
      [bookingData.clientEmail],
      "Appointment Confirmation - Sri Harshavardhini Image Consultancy",
      clientEmailContent,
    )

    // Send email to business
    await sendEmail(
      ["prabhushankar2626@gmail.com"],
      "New Appointment Booking - Sri Harshavardhini Image Consultancy",
      businessEmailContent,
    )

    return { success: true }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: "Failed to send emails" }
  }
}

export async function sendCancellationEmails(bookingData: any) {
  const clientEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Sri Harshavardhini Image Consultancy</h1>
        <p style="color: white; margin: 5px 0 0 0;">Appointment Cancellation</p>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Dear ${bookingData.clientName},</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Your appointment with Sri Harshavardhini Image Consultancy Service has been successfully cancelled.
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="color: #1f2937; margin-top: 0;">Cancelled Appointment Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Booking ID:</td><td>${bookingData.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td>${bookingData.serviceName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Duration:</td><td>${bookingData.duration} minutes</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Original Date:</td><td>${bookingData.date}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Original Time:</td><td>${bookingData.time}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Amount:</td><td>₹${bookingData.amount}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Cancelled on:</td><td>${bookingData.cancellationDate}</td></tr>
          </table>
        </div>
        <p style="color: #4b5563; line-height: 1.6;">
          If you need to reschedule or book a new appointment, please visit our website or contact us directly.
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Contact Information</h3>
          <p style="margin: 5px 0;"><strong>Consultant:</strong> ${bookingData.consultantName}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${bookingData.consultantPhone}</p>
          <p style="margin: 5px 0;"><strong>Studio Address:</strong> ${bookingData.studioAddress}</p>
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

  const businessEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Appointment Cancellation Notice</h1>
        <p style="color: white; margin: 5px 0 0 0;">Client Cancellation Notification</p>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Appointment Cancelled</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          A client has cancelled their appointment. The time slot is now available for other bookings.
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="color: #1f2937; margin-top: 0;">Client Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${bookingData.clientName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${bookingData.clientEmail}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${bookingData.clientPhone}</td></tr>
          </table>
        </div>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="color: #1f2937; margin-top: 0;">Cancelled Appointment Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Booking ID:</td><td>${bookingData.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td>${bookingData.serviceName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Duration:</td><td>${bookingData.duration} minutes</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Original Date:</td><td>${bookingData.date}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Original Time:</td><td>${bookingData.time}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Amount:</td><td>₹${bookingData.amount}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Cancelled on:</td><td>${bookingData.cancellationDate}</td></tr>
          </table>
        </div>
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Action Required:</strong> Please update your schedule accordingly. The time slot is now available for new bookings.
          </p>
        </div>
      </div>
    </div>
  `

  try {
    // Send email to client
    await sendEmail(
      [bookingData.clientEmail],
      "Appointment Cancellation Confirmation - Sri Harshavardhini Image Consultancy",
      clientEmailContent,
    )

    // Send email to business
    await sendEmail(
      ["prabhushankar2626@gmail.com"],
      "Appointment Cancellation Notice - Sri Harshavardhini Image Consultancy",
      businessEmailContent,
    )

    return { success: true }
  } catch (error) {
    console.error("Cancellation email sending failed:", error)
    return { success: false, error: "Failed to send cancellation emails" }
  }
}