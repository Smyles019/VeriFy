import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  image: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Processing' }, // default is 'Processing'
  verdict: String,  // <-- add this
  notes: String,    // <-- and this
  sources: [String], // <-- and this
  evidence: String,
  articleLink: {
  type: String,
  required: false},
  article: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Article",
}, 
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
}, { timestamps: true });


export default mongoose.model('Claim', claimSchema);
