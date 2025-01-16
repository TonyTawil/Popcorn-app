import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// ... other imports

const app = express();

// More permissive CORS configuration for development
const corsOptions = {
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Add this middleware to log cookies for debugging
app.use((req, res, next) => {
  console.log('Cookies received:', req.cookies);
  next();
}); 

// Add this error handling middleware at the end
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404s with JSON response
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
}); 