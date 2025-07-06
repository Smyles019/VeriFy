import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const articleSchema = new mongoose.Schema({
   title: { type: String, required: true, trim: true},
   content: { type: String, required: true},
   tags: [{ type: String, trim: true}],
   image: { type: String, default: ''},
   submittedBy: { type: String, required: true},
   submittedAt: { type: Date, default: Date.now},
   status: { type: String, enum: ['pending_review', 'approved', 'rejected', 'published'], default: 'pending_review'},
   reviewedBy: { type: String},
   reviewedAt: { type: Date},
   originalDraftId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Draft'
   },
    likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  flags: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  }, // Embed comments directly in the article schema
   verdict: { type: String },
   reviewerNotes: { type: String },
   sources: [String],
   comments: [commentSchema],
}, {
   timestamps: true,

});

//Index for better query performance
articleSchema.index({ submittedAt: -1 });
articleSchema.index({ status: 1 });
articleSchema.index({ submittedBy: 1});

const Article = mongoose.model('Article', articleSchema);
const Comment = mongoose.model('Comment', commentSchema);


export default Article;