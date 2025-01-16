import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendVerificationEmail(email, verificationUrl) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Popcorn <hello@antoinetawil.com>',
      to: email,
      subject: 'Verify your Popcorn account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Welcome to Popcorn! 🍿</h1>
          <p style="color: #4a4a4a; font-size: 16px;">
            Thanks for signing up! Please verify your email address to complete your registration.
          </p>
          <div style="margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #e11d48; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this URL into your browser:<br>
            <span style="color: #0066cc;">${verificationUrl}</span>
          </p>
        </div>
      `
    })

    if (error) {
      console.error('Error sending verification email:', error)
      throw new Error('Failed to send verification email')
    }

    console.log('Verification email sent:', data)
    return data
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error)
    throw error
  }
}

export default sendVerificationEmail
