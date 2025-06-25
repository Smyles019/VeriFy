import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_RESET || "15m",
  });

  const resetUrl = `http://localhost:5173/reset-password/${token}`;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Hello from <span style="color:#2563eb">VeriFy</span> 👋</h2>
    <p>We received a request to reset your password.</p>
    <p>Click the button below to set a new password:</p>
    <a href="${resetUrl}" style="
      display: inline-block;
      padding: 10px 20px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 10px;
    ">
      Reset Password
    </a>
    <p style="margin-top: 20px;">If you didn’t request this, feel free to ignore this email.</p>
    <p style="font-size: 12px; color: #888;">This link will expire in 15 minutes.</p>
  </div>
`;


  await sendEmail(user.email, "Reset Password - VeriFy", `Use this link to reset your password: ${resetUrl}`, htmlContent);

  res.json({ message: "Reset email sent" });
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

