const express = require("express"),
    router = express.Router({
        mergeParams: true
    }),
    Travel = require("../models/travel"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");


//Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Travel.findById(req.params.id, (err, travel) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
    Travel.findById(req.params.id, (err, travel) => {
        if (err) {
            console.log(err);
            res.redirect("/travels");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
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
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
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
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Yorumun başarıyla güncellendi.");
            res.redirect("/travels/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Yorumun başarıyla silindi.");
            res.redirect("/travels/" + req.params.id);
        }
    });
});

module.exports = router;