var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Travel = require("../models/travel");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments New
router.get("/new", middleware.isLoggedIn, function (req, res) {
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
router.post("/", middleware.isLoggedIn, function (req, res) {
    Travel.findById(req.params.id, function (err, travel) {
        if (err) {
            console.log(err);
            res.redirect("/travels");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Sanırım bir yerde hata yaptın...");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    travel.comments.push(comment);
                    travel.save();
                    req.flash("success", "Yorumun başarıyla eklendi.");
                    res.redirect('/travels/' + travel._id);
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
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
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Yorumun başarıyla güncellendi.");
            res.redirect("/travels/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Yorumun başarıyla silindi.");
            res.redirect("/travels/" + req.params.id);
        }
    });
});


module.exports = router;