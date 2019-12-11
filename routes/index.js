const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


//root route
router.get("/", (req, res) => {
    res.render("landing");
});

// show register form
router.get("/register", (req, res) => {
    res.render("register");
});

//handle sign up logic
router.post("/register", (req, res) => {
    const newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "GezinFO'ya hoşgeldin " + user.username);
            res.redirect("/travels");
        });
    });
});

// show login form
router.get("/login", (req, res) => {
    res.render("login");

});

// handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/travels",
    failureRedirect: "/login",
}), (req, res) => {});

// logic route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Tekrar görüşmek dileğiyle");
    res.redirect("/travels");
});

module.exports = router;