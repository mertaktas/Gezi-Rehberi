const express = require("express"),
    router = express.Router(),
    Travel = require("../models/travel"),
    middleware = require("../middleware");


// INDEX - show all travels
router.get("/", (req, res) => {
    Travel.find({}, (err, allTravels) => {
        if (err) {
            console.log(err);
        } else {
            res.render("travels/index", {
                travels: allTravels
            });
        }
    });
});

// CREATE - add new travel
router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newTravel = {
        name: name,
        image: image,
        description: desc,
        author: author
    }
    Travel.create(newTravel, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/travels");
        }
    });
});


// NEW - show form to create new travel
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("travels/new");
});

// SHOW - show more info about one travel
router.get("/:id", (req, res) => {
    Travel.findById(req.params.id).populate("comments").exec((err, foundTravel) => {
        if (err) {
            console.log(err);
        } else {
            res.render("travels/show", {
                travel: foundTravel
            });
        }
    })
});

// EDIT - Travel Route
router.get("/:id/edit", middleware.checkTravelOwnership, (req, res) => {
    Travel.findById(req.params.id, (err, foundTravel) => {
        if (err) {
            res.redirect("/travels")
        } else {
            res.render("travels/edit", {
                travel: foundTravel
            });
        }
    });
});

// UPDATE - Travel Route
router.put("/:id", middleware.checkTravelOwnership, (req, res) => {
    Travel.findByIdAndUpdate(req.params.id, req.body.travel, (err) => {
        if (err) {
            res.redirect("/travels");
        } else {
            res.redirect("/travels/" + req.params.id);
        }
    });
});

// DESTROY - Travel Route
router.delete("/:id", middleware.checkTravelOwnership, (req, res) => {
    Travel.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/travels");
        } else {
            res.redirect("/travels");
        }
    })
});


module.exports = router;