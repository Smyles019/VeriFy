import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js" ;
import Drafts from "./models/Drafts.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Routes 
app.use("/api/auth", authRoutes); //authentication routes

//draft routes
app.get('/api/drafts', async (req, res) => {
  const drafts = await Draft.find();
  res.json(drafts);
});

app.post('/api/drafts', async (req, res) => {
  const newDraft = new Draft(req.body);
  await newDraft.save();
  res.status(201).json(newDraft);
});

app.put('/api/drafts/:id', async (req, res) => {
  const updated = await Draft.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/api/drafts/:id', async (req, res) => {
  await Draft.findByIdAndDelete(req.params.id);
  res.status(204).end();
});


//Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on posrt ${PORT}`));
    })
    .catch((err) => console.log(err));
    



