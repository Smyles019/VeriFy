import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 firstName: { type: String },
  lastName: { type: String },
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  phone: {
  type: String,
  required: [true, "Phone number is required"],
  unique: true,
  match: [/^(\+254|0)(1\d{8}|7\d{8})$/, "Please enter a valid Kenyan phone number"]
},
  password: {
  type: String,
  required: [true, "Password is required"],
  minlength: [8, "Password must be at least 8 characters"],
},
  profilePicUrl: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  role: {
    type: String,
    enum: ['reader', 'reporter', 'fact-checker', 'editor', 'admin'],
    default: 'reader', 
  },
  createdAt: {
    type: Date,
    default: Date.now,
   active: { type: Boolean, default: true } 
  },
});

export default mongoose.model("User", userSchema);
