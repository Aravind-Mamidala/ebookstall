const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { isAdmin } = require("../middleware/checkRole");
const Comment = require("../models/Comment");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Render the "Add Book" form (GET request)
router.get("/add", isAdmin, (req, res) => {
    res.render("books/add");
});

// Handle Book Creation (POST request)
router.post("/add", isAdmin, async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.redirect("/books");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all books
router.get("/", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.render("books/index", { books });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single book by ID
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        const comments = await Comment.find({ bookId: book._id }); // Get comments for this book
        res.render("books/show", { book, user: req.user, comments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit a book by ID
router.get("/:id/edit", isAdmin, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.render("books/edit", { book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a book by ID
router.put("/:id", isAdmin, async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: "Book not found" });
        res.redirect(`/books/${req.params.id}`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a book by ID
router.delete("/:id", isAdmin, async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Handle comment submission
router.post("/:id/comments", isLoggedIn, async (req, res) => {
    try {
        const { text, rating } = req.body;
        const bookId = req.params.id;

        if (!req.user) {
            return res.status(401).send("You must be logged in to comment.");
        }

        const newComment = new Comment({
            bookId: bookId,
            userId: req.user._id,
            username: req.user.username,
            text,
            rating
        });

        await newComment.save();
        res.redirect(`/books/${bookId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error submitting comment");
    }
});

// Delete a comment by ID
router.delete("/:bookId/comments/:commentId", isLoggedIn, async (req, res) => {
    try {
        const { bookId, commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Ensure the user is either the author of the comment or an admin
        if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);
        res.redirect(`/books/${bookId}`);
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;