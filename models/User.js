const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: false }, // Optional username
  googleId: { type: String, unique: true, sparse: true}, // For Google OAuth users
  name: { type: String, required: true }, // Required name
  email: { type: String, required: true, unique: true }, // Unique email
  password: { type: String, default: null }, // Empty for Google users
  role: { 
    type: String, 
    enum: ["admin", "seller", "buyer"], 
    default: "buyer" // Default role is buyer
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});

// Ensure that at least one of `googleId` or `password` exists
userSchema.pre("save", function (next) {
  if (!this.password && !this.googleId) {
    return next(new Error("Either password or Google ID must be provided"));
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
