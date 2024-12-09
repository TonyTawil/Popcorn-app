import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_APP_EMAIL,
    pass: process.env.BREVO_APP_PASSWORD,
  },
});

async function sendVerificationEmail(email, verificationUrl) {
  const result = await transporter.sendMail({
    from: process.env.GMAIL_APP_EMAIL,
    to: email,
    subject: "NameAnimalThing Account Verification Email",
    text: `Click the link below to verify your email address 
    ${verificationUrl}`,
  });

  console.log(JSON.stringify(result, null, 4));
}

export default sendVerificationEmail;
