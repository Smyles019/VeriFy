const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema
(
{
username: {
    type: String,
    required: true,
    unique: true,
  },
  
fisrtName: {
    type: String,
    required: true,
  },

lastName: {
    type: String,
    required: true,
    },
email: {
    type: String,
    required: true,
    unique: true,
  },

phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
    validator: (v) => v.length >= 10 && v.length <= 15 && /^\d+$/.test(v),
    message: "Invalid format", // Validate phone number length and format
  }
},

  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long"]
  },
}
);

module.exports = mongoose.model("User", UserSchema);
