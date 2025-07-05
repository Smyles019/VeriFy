import Claim from '../models/Claim.js';

export const createClaim = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const imagePath = req.file?.path || null;

    const newClaim = new Claim({
      title,
      content,
      category,
      user: req.user._id,
      image: imagePath,
      status: "Processing",
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
      claim.evidence = req.file.path; // or `/uploads/${req.file.filename}`
    }

    await claim.save();
    res.json({ message: "Claim reviewed successfully", claim });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

