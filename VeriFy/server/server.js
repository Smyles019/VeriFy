import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"; // Importing authRoutes using ES6 import syntax
import authRoutes from "./routes/auth.js";

dotenv.config(); 

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", authRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error("DB connection error:", err));
