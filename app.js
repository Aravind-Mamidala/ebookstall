const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const methodOverride = require("method-override");
const path = require("path");
app.use(methodOverride("_method"));

const port = process.env.PORT || 5000;

const session = require("express-session");
const flash = require("connect-flash");
app.use(session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Secure in production
        maxAge: 1000 * 60 * 10 // ✅ Keep session for 10 minutes
    }
}));
app.use(flash());


const passport = require("./config/passport");


const authRoutes=require("./routes/authRoutes");
const branchesRoutes=require("./routes/branches");
const pagesRoutes = require("./routes/index");
const cartRoutes=require("./routes/cart");
const profileRoutes = require("./routes/profile"); // Import Profile Route
const wishlistRoutes=require("./routes/wishlist");
const chatRouter = require('./routes/chat');


const engine=require("ejs-mate");
app.engine("ejs",engine);
app.set("view engine","ejs");
app.set("views", __dirname + "/views");

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ebookstall', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected 🚀"))
.catch((err) => console.error("MongoDB connection error ❌:", err));
// passport

app.use((req, res, next) => {
    res.locals.user=req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});








app.use(passport.initialize());
app.use(passport.session());        

// ✅ Set EJS as View Engine
app.set("view engine", "ejs");

// ✅ Middleware Order Matters!
app.use(express.urlencoded({ extended: true }));  // ✅ Handles form data
app.use(express.json());  // ✅ Handles JSON data
app.use(methodOverride("_method"));  // ✅ Supports PUT & DELETE
app.use(express.static(path.join(__dirname, "public")));  // ✅ Serve static files like CSS

app.use((req, res, next) => {
    res.locals.user = req.user || null; // Set user globally
    next();
});



// ✅ Import and Use Routes
const bookRoutes = require("./routes/bookRoutes");
app.use("/books", bookRoutes);
app.use("/auth/",authRoutes);
app.use("/branches",branchesRoutes);
app.use("/", pagesRoutes);
app.use("/cart", cartRoutes);
app.use("/profile", profileRoutes); // Use Profile Route
app.use("/wishlist",wishlistRoutes);
app.use('/chat', chatRouter);

app.get("/test-flash", (req, res) => {
    req.flash("success", "This is a test success message!");
    req.flash("error", "This is a test error message!");
    res.redirect("/show-flash");
});

app.get("/show-flash", (req, res) => {
    res.render("test", { success: req.flash("success"), error: req.flash("error") }); // ✅ Pass flash directly
});



// ✅ Root Route
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.get("/dashboard", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/login"); // Redirect if not logged in
    }
    res.render("dashboard", { user: req.user }); // Pass logged-in user
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
