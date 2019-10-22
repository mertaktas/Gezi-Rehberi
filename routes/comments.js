var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Travel = require("../models/travel");
var Comment = require("../models/comment");

//Comments New
router.get("/new", isLoggedIn, function (req, res) {
    Travel.findById(req.params.id, function (err, travel) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                travel: travel
            });
        }
    })
});

//Comments Create
router.post("/", isLoggedIn, function (req, res) {
    Travel.findById(req.params.id, function (err, travel) {
        if (err) {
            console.log(err);
            res.redirect("/travels");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    travel.comments.push(comment);
                    travel.save();
                    res.redirect('/travels/' + travel._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;