import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import Drafts from "./models/Drafts.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

  //Routes
  app.get('/api/drafts', async (req, res) => {
    const drafts = await Drafts.find();
    res.json(drafts);
  });

  app.post('/api/drafts', async (req, res) => {
    console.log('Received draft:', req.body);
    try{
      const newDraft = new Drafts(req.body);
      await newDraft.save();
      res.status(201).json(newDraft);
    } catch (error) {
      console.error('Error saving draft:', error);
      res.status(500).json({ error: 'Failed to create draft'});
    }
  });

  app.put('/api/drafts/:id', async (req, res) => {
    const updated = await Drafts.findByIdAndUpdate(req.params.id, req.body, { new: true});
    res.json(updated);
  });

  app.delete('/api/drafts/:id', async (req, res) => {
    await Drafts.findByIdAndDelete(req.params.id);
    res.status(204).end(); 
  });

 

