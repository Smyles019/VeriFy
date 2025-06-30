// controllers/userController.js
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // assuming you're using middleware to attach user from token

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Failed to fetch user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// controllers/userController.js
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
