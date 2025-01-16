import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser'

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import tmdbRoutes from "./routes/tmdb.routes.js";

import connectToMongo from "./db/connectToMongo.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// IMPORTANT: Order matters - cookieParser before CORS
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Be explicit about the origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Debug middleware to log all requests and cookies
app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  console.log('Cookies:', req.cookies);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/tmdb", tmdbRoutes);

app.listen(PORT, () => {
  connectToMongo();
  console.log(`Server is running on port ${PORT}`);
});
