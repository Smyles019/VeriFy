import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import Drafts from "./models/Drafts.js";
import Article from "./models/Article.js";
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import fs from 'fs';
import claimRoutes from './routes/claimRoutes.js';
import articleActions from  './routes/articleActions.js';
import applicationRoutes from './routes/applicationRoutes.js';
import articleRoutes from './routes/articleRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/articles", articleActions);
app.use("/api/applications", applicationRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/articles', articleRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Update a user by ID
app.put('/api/user/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

//Fetching drafts from reporter dashboard
app.get('/api/drafts', async (req, res) => {
  try {
  const { submittedBy }  = req.query;
  const filter = submittedBy ? { submittedBy } : {};
  const drafts = await Drafts.find(filter).sort({ createdAt: -1 });
  res.json(drafts);
 } catch (error){
  console.error('Error fetching drafts:', error);
  res.status(500).json({ error: 'Failed to fetch drafts' });
 }
});

app.post('/api/drafts', upload.single('image'), async (req, res) => {
  console.log('Received draft:', req.body);
  try {
    const { title, content, tags, submittedBy } = req.body;
    const image = req.file ? req.file.filename : null;
    const newDraft = new Drafts ({
      title,
      content,
      tags: tags ? [tags] : [],  
      image,
      submittedBy
  });
    await newDraft.save();
    res.status(201).json(newDraft);
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ error: 'Failed to create draft' });
  }
});

app.put('/api/drafts/:id', upload.single('image'), async (req, res) => {
  try{
  const { title, content, tags, existingImage } = req.body; 
  const updatedData = { 
    title,
    content, 
    tags: tags ? [tags] : [], 
    image: req.file ? req.file.filename : existingImage || undefined
   };

  if (req.file) updatedData.image = req.file.filename;

  const updated = await Drafts.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  if (!updated){
    return res.status(404).json({ error: 'Draft not found' });
  }
  res.json(updated);
} catch (error){
  console.error('Error updating draft:', error);
  res.status(500).json({error: 'Failed to update draft' });
}
});

app.delete('/api/drafts/:id', async (req, res) => {
  try{
  const deleted = await Drafts.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Draft not found' });
  }
  res.status(204).end(); 
 } catch (error) {
   console.error('Error deleting draft:', error);
   res.status(500).json({ error: 'Failed to delete draft' });
 } 
});

//Article routes for submitted drafts 
app.get('/api/articles', async (req, res) => {
   try{
    const articles = await Article.find().sort({ submittedAt: -1 });
    res.json(articles);
   } catch (error) {
     console.error('Error fetching articles:', error);
     res.status(500).json({ error: 'Failed to fetch articles' });
   }
});

//Routes for posting articles 
app.post('/api/articles', upload.single('image'), async (req, res) => {
  console.log('Received article submission:', req.body);
  try{
    //creating new article from submitted draft
    const { title, content, tags, submittedBy, submittedAt, status } = req.body;
    const image = req.file ? req.file.filename : req.body.existingImage || null;
    const articleData = {
      title,
      content,
      tags,
      image,
      submittedBy,
      submittedAt: submittedAt || new Date(),
      status: status || 'pending_review'
    };

    const newArticle = new Article(articleData);
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error saving artice:', error);
    res.status(500).json({ error: 'Failed to create article'});
  }
});

app.get('/api/articles/:id', async (req, res) => {
    try{
    const article = await Article.findById(req.params.id);
    if(!article){
      return res.status(404).json({ error: 'Article not found'});      
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article'});
  }
});

app.put('/api/articles/:id/status', async (req, res) => {
  try{
    const { status } = req.body;
    const validStatuses = ['pending_review', 'approved', 'rejected', 'published'];

    if(!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await Article.findByIdAndUpdate(
      req.params.id, {
        status,
        reviewedAt: new Date()
      },
      { new: true }
    );

    if (!updated){
      return res.status(404).json({ error: 'Article not found'});
    }
    res.json(updated);

  } catch (error){
    console.error('Error updating article status:', error);
    res.status(500).json({ error: 'Failed to update article status'});
  }
});

app.put('/api/articles/:id', async (req, res) => {
  try{
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated){
      return res.status(404).json({ error: 'Article not found' });  
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article '});
  }

});

app.delete('/api/articles/:id', async (req, res) => {
  try{
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if(!deleted){
      return res.status(404).json({ error: 'Article not found' });     
    }
    res.status(204).end();

  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
