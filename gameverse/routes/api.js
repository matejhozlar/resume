import express from "express";
const router = express.Router();

router.get("/account-settings", (req, res) => {
    res.render("partials/account-settings.ejs");
});

export default router;