import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateJwtToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // in millseconds
    httpOnly: true, // cannot be accessed or modified in any way by the browser to prevent XSS attacks
    sameSite: true, // prevents CSRF attacks
    secure: process.env.NODE_ENV === "production" ? true : false, // cookie will only be set on HTTPS in production
  });
};

export default generateJwtToken;
