const express = require("express");
const router = express.Router();
const Book=require("../models/Book");

router.get("/cse", async (req, res) => {
    try {
        const books = await Book.find({ category: { $regex: new RegExp("^cse$", "i") } });
        res.render("branches/cse", { title: "CSE Books", books, layout: "layouts/boilerplate" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


router.get("/ai_ml", async (req, res) => {
    try {
        const books = await Book.find({ category: { $regex: new RegExp("^ai_ml$", "i") } });
        res.render("branches/ai_ml", { title: "AI & ML Books", books, layout: "layouts/boilerplate" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.get("/ece", async (req, res) => {
    try {
        const books = await Book.find({ category: { $regex: new RegExp("^ece$", "i") } });
        res.render("branches/ece", { title: "ECE Books", books, layout: "layouts/boilerplate" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.get("/chem", async (req, res) => {
    try {
        const books = await Book.find({ category: { $regex: new RegExp("^chem$", "i") } });
        res.render("branches/chem", { title: "CHEM Books", books, layout: "layouts/boilerplate" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.get("/civil", async (req, res) => {
    try {
        const books = await Book.find({ category: { $regex: new RegExp("^civil$", "i") } });
        res.render("branches/civil", { title: "CIVIL Books", books, layout: "layouts/boilerplate" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.get("/eee", async (req, res) => {
    try {
        const books = await Book.find({ category: { $regex: new RegExp("^eee$", "i") } });
        res.render("branches/eee", { title: "EEE Books", books, layout: "layouts/boilerplate" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

router.get("/mech", async (req, res) => {
    try {
        const books = await Book.find({ category: { $regex: new RegExp("^mech$", "i") } });
        res.render("branches/mech", { title: "MECH Books", books, layout: "layouts/boilerplate" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
module.exports = router;
