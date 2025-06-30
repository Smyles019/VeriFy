import mongoose from "mongoose"

const articleSchema = new mongoose.Schema({
   title: { type: String, required: true, trim: true},
   content: { type: String, required: true},
   tags: [{ type: String, trim: true}],
   image: { type: String},
   submittedBy: { type: String, required: true},
   submittedAt: { type: Date, default: Date.now},
   status: { type: String, enum: ['pending_review', 'approved', 'rejected', 'published'], default: 'pending_review'},
   reviewedBy: { type: String},
   reviewedAt: { type: Date},
   originalDraftId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Draft'
   }
}, {
   timestamps: true 
});

//Index for better query performance
articleSchema.index({ submittedAt: -1 });
articleSchema.index({ status: 1 });
articleSchema.index({ submittedBy: 1});

const Article = mongoose.model('Article', articleSchema);

export default Article;