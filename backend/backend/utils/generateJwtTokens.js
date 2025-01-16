import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateJwtToken = (userId, isVerified, res) => {
  console.log('Generating JWT for userId:', userId, 'verified:', isVerified);
  
  if (!isVerified) {
    console.log('Refusing to generate token for unverified user');
    return null;
  }

  const token = jwt.sign({ 
    userId,
    isVerified 
  }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: '/'
  });

  return token;
};

export default generateJwtToken;
