const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Login Page (GET)
router.get("/login", (req, res) => {
    res.render("users/login", { error: req.flash("error") });
});

// GET Register Page
router.get("/register", (req, res) => {
    res.render("users/register", { error: req.flash("error") });
});

// ✅ Register (Local)
router.post("/register", async (req, res) => {
    const { name, email, password, username } = req.body;
    let user = await User.findOne({ email });

    if (user) {
        req.flash("error", "You have an account already!");
        return res.redirect("/auth/register");  // ✅ Redirect to register page
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, username, password: hashedPassword });

    await user.save();
    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/auth/login");  // ✅ Redirect to login page
});

// ✅ Login (Local)
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash("error", "Invalid credentials!");
            return res.redirect("/auth/login");
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome back, " + user.username + "!");
            return res.redirect("/books");
        });
    })(req, res, next);
});


// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/login" }),
    async (req, res) => {
        if (!req.user.username) {
            req.user.username = req.user.name.toLowerCase().replace(/\s/g, "_"); // Auto-generate username
            await req.user.save(); // Save the update
        }
        console.log("Google Login - User:", req.user.username, req.user.email);
        res.redirect("/books");
    }
);

// ✅ Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully!");
        res.redirect("/books"); // ✅ Redirect to login after logout
    });
});



module.exports = router;