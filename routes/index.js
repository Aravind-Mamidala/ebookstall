const express = require("express");
const router = express.Router();

// 📌 About Us Page Route
router.get("/about", (req, res) => {
    res.render("about");
});

// 📌 Contact Us Page Route
router.get("/contact", (req, res) => {
    res.render("contact");
});

// 📌 Handle Contact Form Submission (Optional)
router.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    console.log(`📩 Message from ${name} (${email}): ${message}`);
    res.send("Thanks for reaching out! We'll get back to you soon.");
});

module.exports = router;
