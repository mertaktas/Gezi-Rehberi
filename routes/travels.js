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
router.post("/", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newTravel = {
        name: name,
        image: image,
        description: desc
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
router.get("/new", function (req, res) {
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

module.exports = router;