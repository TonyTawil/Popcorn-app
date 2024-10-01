import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
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
