module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    // ✅ If request is from an API call, return JSON
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    // ❌ If request is from a browser, redirect to login page
    res.redirect("/auth/login");
};
