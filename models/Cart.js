const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
    totalPrice: { type: Number, required: true, default: 0 } // ✅ Correct field name
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
