import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateJwtToken from "../utils/generateJwtTokens.js";
import generateEmailToken from "../utils/generateEmailTokens.js";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      gender,
      isGoogleAccount,
    } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isGoogleAccount) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            "Password must be at least 8 characters long and contain both letters and numbers",
        });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }
    }

    const userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );

    const verificationToken = generateEmailToken();
    console.log("Generated verification token for signup:", verificationToken);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      gender,
      profilePic: gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`,
      isGoogleAccount,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const savedUser = await newUser.save();
    console.log("Saved user verification details:", {
      id: savedUser._id,
      email: savedUser.email,
      token: savedUser.emailVerificationToken,
      expiry: savedUser.emailVerificationTokenExpiry
    });

    if (!isGoogleAccount) {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await sendVerificationEmail(newUser.email, verificationUrl);
    }

    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(201).json({
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      username: savedUser.username,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
      verified: savedUser.isEmailVerified
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      error: "An error occurred during the signup process",
      details: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with explicit settings
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log('Setting cookie in login:', {
      token: token.substring(0, 20) + '...',
      cookies: res.getHeader('set-cookie')
    });

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || '',
      verified: user.isEmailVerified
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("Attempting to verify email with token:", token);

    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    // First check if any user was previously verified with this token
    const verifiedUser = await User.findOne({ 
      $or: [
        { emailVerificationToken: token },
        { _id: { $in: await User.find({ isEmailVerified: true }).distinct('_id') } }
      ]
    });

    if (verifiedUser && verifiedUser.isEmailVerified) {
      // User is already verified, send success response with user data
      return res.status(200).json({
        message: "Email already verified",
        user: {
          _id: verifiedUser._id,
          firstName: verifiedUser.firstName,
          lastName: verifiedUser.lastName,
          username: verifiedUser.username,
          email: verifiedUser.email,
          profilePic: verifiedUser.profilePic || verifiedUser.profilePicture || '',
          verified: true
        }
      });
    }

    // Find user with valid token
    const user = await User.findOne({ 
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        error: "Invalid or expired verification token" 
      });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save();

    // Generate new JWT with updated verification status
    generateJwtToken(user._id, res);

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic || user.profilePicture || '',
        verified: true
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: "An error occurred during email verification",
      details: error.message 
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email is already verified" })
    }

    const verificationToken = generateEmailToken()
    user.emailVerificationToken = verificationToken
    user.emailVerificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await user.save()

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
    await sendVerificationEmail(user.email, verificationUrl)

    res.status(200).json({ 
      message: "Verification email resent successfully" 
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    res.status(500).json({ 
      error: "Failed to resend verification email" 
    })
  }
}

export const isEmailVerified = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ isEmailVerified: user.isEmailVerified });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while checking email verification status",
    });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // User is already attached by protect middleware
    const user = req.user;
    
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || '',
      verified: user.isEmailVerified
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ error: 'Not authenticated' });
  }
};
