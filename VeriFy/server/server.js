const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");


const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

require("dotenv").config();
console.log("Loaded URI:", process.env.MONGO_URI);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error("DB connection error:", err));
