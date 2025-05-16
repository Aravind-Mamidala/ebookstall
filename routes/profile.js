const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const User = require("../models/User"); // Ensure you have a User model

const router = express.Router();

// ✅ Profile Page Route
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.render("profile", { user });
    } catch (err) {
        console.error("Profile Page Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;