import mongoose from "mongoose";

const movieListSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    coverImage: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    profilePicture: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { 
      type: String,
      index: true
    },
    emailVerificationTokenExpiry: { 
      type: Date
    },
    isGoogleAccount: { type: Boolean, default: false },
    watchList: [movieListSchema],
    watched: [movieListSchema],
  },
  { timestamps: true }
);

userSchema.index({ 
  emailVerificationToken: 1, 
  emailVerificationTokenExpiry: 1 
});

const User = mongoose.model("User", userSchema);

export default User;
