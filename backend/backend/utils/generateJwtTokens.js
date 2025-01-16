import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateJwtToken = (userId, res) => {
  console.log('Generating JWT for userId:', userId);
  
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
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
