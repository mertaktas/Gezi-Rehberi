var express = require("express");
var router = express.Router();
var Travel = require("../models/travel");


// INDEX - show all travels
router.get("/", function (req, res) {
    Travel.find({}, function (err, allTravels) {
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
router.post("/", isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTravel = {
        name: name,
        image: image,
        description: desc,
        author: author
    }
    Travel.create(newTravel, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/travels");
        }
    });
});


// NEW - show form to create new travel
router.get("/new", isLoggedIn, function (req, res) {
    res.render("travels/new");
});

// SHOW - show more info about one travel
router.get("/:id", function (req, res) {
    Travel.findById(req.params.id).populate("comments").exec(function (err, foundTravel) {
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
router.get("/:id/edit", checkTravelOwnership, function (req, res) {
    Travel.findById(req.params.id, function (err, foundTravel) {
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

router.put("/:id", checkTravelOwnership, function (req, res) {

    Travel.findByIdAndUpdate(req.params.id, req.body.travel, function (err, updatedTravel) {
        if (err) {
            res.redirect("/travels");
        } else {
            res.redirect("/travels/" + req.params.id);
        }
    });
});

// DESTROY - Travel Route
router.delete("/:id", checkTravelOwnership, function (req, res) {
    Travel.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/travels");
        } else {
            res.redirect("/travels");
        }
    })
});

function checkTravelOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Travel.findById(req.params.id, function (err, foundTravel) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the travel?
                if (foundTravel.author.id.equals(req.user._id)) {
                    next();
                } else {

                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;