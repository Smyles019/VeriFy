import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
});

export default mongoose.model("User", userSchema);
