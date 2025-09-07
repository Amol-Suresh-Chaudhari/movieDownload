import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Create transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      secure: true,
      port: 465,
      tls: {
        rejectUnauthorized: false
      }
    })

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #495057; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #6c757d;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
              This email was sent from the AllMoviesHub contact form.
            </p>
          </div>
        </div>
      `
    }

    // Auto-reply to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting AllMoviesHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff; text-align: center;">Thank You for Contacting Us!</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to AllMoviesHub. We have received your message regarding "<strong>${subject}</strong>" and will get back to you within 24-48 hours.</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #495057;">Your Message:</h3>
            <p style="line-height: 1.6; color: #6c757d; font-style: italic;">"${message}"</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6c757d;">Best regards,<br><strong>AllMoviesHub Team</strong></p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
              Visit us at <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://allmovieshub.com'}" style="color: #007bff;">AllMoviesHub</a>
            </p>
          </div>
        </div>
      `
    }

    // Send emails
    try {
      await transporter.sendMail(adminMailOptions)
      await transporter.sendMail(userMailOptions)
      
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      
      // If email fails, still return success but log the error
      // This prevents user from seeing email configuration errors
      return NextResponse.json({
        success: true,
        message: 'Message received! We\'ll get back to you soon.',
        note: 'Email notification may be delayed'
      })
    }

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    )
  }
}
