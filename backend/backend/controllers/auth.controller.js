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
    
    // Double-check the saved user
    const verifiedSave = await User.findById(savedUser._id);
    console.log("Verification details after save:", {
      token: verifiedSave.emailVerificationToken,
      expiry: verifiedSave.emailVerificationTokenExpiry,
      email: verifiedSave.email
    });

    if (!isGoogleAccount) {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await sendVerificationEmail(newUser.email, verificationUrl);
    }

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

    if (!user.isEmailVerified) {
      return res.status(401).json({ 
        error: "Please verify your email before logging in",
        needsVerification: true 
      });
    }

    const token = generateJwtToken(user._id, user.isEmailVerified, res);

    if (!token) {
      return res.status(400).json({ 
        error: "Failed to generate authentication token" 
      });
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

    // Find user with valid token - be more strict about the conditions
    const user = await User.findOne({ 
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { $gt: Date.now() }
    });

    console.log("Found user:", user ? {
      email: user.email,
      isVerified: user.isEmailVerified,
      tokenExpiry: user.emailVerificationTokenExpiry,
      currentTime: new Date(),
    } : 'No user found');

    // Debug log to check all users and their tokens
    const allUsers = await User.find({}, 'email emailVerificationToken emailVerificationTokenExpiry');
    console.log("All users verification tokens:", allUsers.map(u => ({
      email: u.email,
      token: u.emailVerificationToken,
      expiry: u.emailVerificationTokenExpiry
    })));

    if (!user) {
      // Check if this token was already used for verification
      const verifiedUser = await User.findOne({
        emailVerificationToken: token
      });

      if (verifiedUser) {
        // If already verified, still send success with user data
        const jwtToken = generateJwtToken(verifiedUser._id, true, res);

        if (!jwtToken) {
          return res.status(400).json({ 
            error: "Failed to generate authentication token" 
          });
        }

        return res.status(200).json({
          message: "Email already verified",
          user: {
            _id: verifiedUser._id,
            firstName: verifiedUser.firstName,
            lastName: verifiedUser.lastName,
            username: verifiedUser.username,
            email: verifiedUser.email,
            profilePic: verifiedUser.profilePic || '',
            verified: true
          }
        });
      }

      return res.status(400).json({ 
        error: "Invalid or expired verification token" 
      });
    }

    // Update user verification status
    user.isEmailVerified = true;
    // Don't remove the token immediately to allow for re-verification if needed
    // user.emailVerificationToken = undefined;
    // user.emailVerificationTokenExpiry = undefined;
    await user.save();

    // Generate JWT token and set cookie
    const jwtToken = generateJwtToken(user._id, true, res);

    if (!jwtToken) {
      return res.status(400).json({ 
        error: "Failed to generate authentication token" 
      });
    }

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic || '',
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
