import express from "express";
const router = express.Router();

router.get("/account-settings", (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");
    res.render("partials/account-settings.ejs", { error, success });
  });

export default router;