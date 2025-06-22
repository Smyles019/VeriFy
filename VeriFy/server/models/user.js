import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
