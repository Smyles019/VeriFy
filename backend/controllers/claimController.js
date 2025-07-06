import Article from "../models/Article.js";
import Claim from "../models/Claim.js";

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).lean();
    if (!article) return res.status(404).json({ message: "Article not found" });

    // 🔍 Get the latest "Reviewed" claim linked to this article
    const reviewedClaim = await Claim.findOne({
      article: article._id,
      status: "Reviewed",
    }).sort({ updatedAt: -1 }).lean();

    if (reviewedClaim) {
  article.verdict = reviewedClaim.verdict;
  article.reviewerNotes = reviewedClaim.notes;
  article.sources = reviewedClaim.sources;
}
    res.json(article);
  } catch (err) {
    console.error("Failed to get article:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createClaim = async (req, res) => {
  try {
    const { title, content, category, articleId } = req.body;

    const existingClaim = await Claim.findOne({ article: articleId, status: "Reviewed"});
    if (existingClaim) {
      return res.status(400).json({ message: "A claim has already been submitted for this article." });
    }

    const imagePath = req.file?.path || null;

    const newClaim = new Claim({
      title,
      content,
      category,
      user: req.user._id,
      image: imagePath,
      status: "Processing",
      article: req.body.articleId, 
      submittedBy: req.user.id,
    });

    await newClaim.save();
    res.status(201).json(newClaim);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit claim" });
  }
};


// For user's own claims
export const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your claims" });
  }
};

// For ALL claims (optional, if needed)
export const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all claims" });
  }
};

export const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("user", "email");
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const reviewClaim = async (req, res) => {
  const { id } = req.params;
  const { verdict, status, notes } = req.body;
  const sources = req.body.sources instanceof Array ? req.body.sources : [req.body.sources];
  const reviewerId = req.user._id;

  try {
    const claim = await Claim.findById(id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.verdict = verdict;
    claim.status = status;
    claim.notes = notes;
    claim.sources = sources;
    claim.reviewedBy = reviewerId;

    if (req.file) {
      claim.evidence = req.file.path;
    }

    await claim.save();

    // ✅ Update related article if it exists
    if (claim.article) {
      await Article.findByIdAndUpdate(claim.article, {
        verdict,
        reviewerNotes: notes,
        sources,
      });
    }

    res.json({ message: "Claim reviewed successfully", claim });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateClaimStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedClaim = await Claim.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.status(200).json(updatedClaim);
  } catch (err) {
    console.error("Error updating claim status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClaimByArticleId = async (req, res) => {
  try {
    const claim = await Claim.findOne({ article: req.params.id });

    if (!claim) {
      return res.status(404).json({ message: "No claim found for this article" });
    }

    res.json(claim);
  } catch (error) {
    console.error("Error fetching claim by article ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};


