const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/authMiddleware");

// ✅ Add book to wishlist
router.post("/add/:bookId", isAuthenticated, async (req, res) => {
    try {
        console.log("🔹 Incoming Request:", req.method, req.url);
        console.log("🔹 User Data:", req.user);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }

        const user = await User.findById(req.user.id).populate("wishlist");

        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.wishlist.includes(req.params.bookId)) {
            user.wishlist.push(req.params.bookId);
            await user.save();
        }

        return res.status(200).json({ message: "Book added to wishlist" });

    } catch (error) {
        console.error("❌ Server Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});





// ✅ Remove book from wishlist
router.delete("/remove/:bookId", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== req.params.bookId
        );
        await user.save();

        return res.status(200).json({ message: "Book removed from wishlist" });
    } catch (error) {
        console.error("❌ Error removing from wishlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

// ✅ View all books in wishlist
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("wishlist");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.render("wishlist", { wishlist: user.wishlist });
    } catch (error) {
        console.error("❌ Error fetching wishlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
