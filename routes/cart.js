const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const Book = require("../models/Book");

const router = express.Router();

// ✅ Add book to the cart
router.post("/add/:bookId", isAuthenticated, async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user._id;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 }); // ✅ Ensure totalPrice is initialized
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).send("No such Book exists");
        }

        const existingItem = cart.items.find(item => item.bookId.toString() === bookId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ bookId, quantity: 1 });
        }

        // ✅ Recalculate total price correctly
        let totalPrice = 0;
        for (let item of cart.items) {
            const bookItem = await Book.findById(item.bookId);
            if (bookItem) {
                totalPrice += bookItem.price * item.quantity;
            }
        }
        cart.totalPrice = totalPrice;

        console.log("Updated Cart Total Price:", cart.totalPrice); // ✅ Debugging log

        await cart.save();
        res.redirect("/cart");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✅ View the cart
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.bookId");
        console.log("Cart from DB:", JSON.stringify(cart, null, 2)); // ✅ Debugging: Print full cart details
        console.log("Cart Total Price:", cart ? cart.totalPrice : "No cart found");

        res.render("cart", { cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Remove book from cart
router.post("/remove/:bookId", isAuthenticated, async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.redirect("/cart");

        cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);

        // ✅ Recalculate total price
        let totalPrice = 0;
        for (let item of cart.items) {
            const bookItem = await Book.findById(item.bookId);
            if (bookItem) {
                totalPrice += bookItem.price * item.quantity;
            }
        }
        cart.totalPrice = totalPrice;

        await cart.save();
        res.redirect("/cart");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
