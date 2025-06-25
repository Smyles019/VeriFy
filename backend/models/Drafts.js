import mongoose from "mongoose";

const draftSchema = new mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String},
    tags: [String],
    image: { type: String},
    createdAt: { type: Date, default: Date.now},
});

export default mongoose.model("Draft", draftSchema);