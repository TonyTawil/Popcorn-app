import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log('Middleware received token:', token);

    if (!token) {
      console.log('No token found in middleware');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.log('No user found for token');
        return res.status(401).json({ error: 'User not found' });
      }

      if (!user.isEmailVerified) {
        console.log('User not verified');
        res.cookie("token", "", {
          httpOnly: true,
          expires: new Date(0),
        });
        return res.status(401).json({ 
          error: 'Email not verified',
          needsVerification: true
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log('Token verification failed:', error.message);
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 