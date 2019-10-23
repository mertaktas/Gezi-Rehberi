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

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                travel_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

// COMMENT UPDATE
router.put("/:comment_id", function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/travels/" + req.params.id);
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