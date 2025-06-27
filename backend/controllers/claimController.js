export const getPendingClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ status: "pending" }).populate("author");
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: "Error fetching claims" });
  }
};
export const giveVerdict = async (req, res) => {
  const { verdict, sources } = req.body;
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: "Claim not found" });

  claim.verdict = verdict;
  claim.sources = sources;
  claim.status = "verified";
  await claim.save();

  res.json({ message: "Verdict submitted" });
};
