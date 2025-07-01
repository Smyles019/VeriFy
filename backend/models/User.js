import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 firstName: { type: String },
  lastName: { type: String },
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  profilePic: { type: String },
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
