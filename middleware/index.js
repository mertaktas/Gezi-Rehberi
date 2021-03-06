const Travel = require("../models/travel"),
    Comment = require("../models/comment");

// All the Middleware
const middlewareObj = {

};

// Check Edit Travel
middlewareObj.checkTravelOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Travel.findById(req.params.id, (err, foundTravel) => {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the travel?
                if (foundTravel.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Bunu yapma izniniz yok.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Giriş yapmanız gerek.");
        res.redirect("back");
    }
}

// Check Edit Comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Bunu yapma izniniz yok.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Giriş yapmanız gerek.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Giriş yapmanız gerek.");
    res.redirect("/login");
}

module.exports = middlewareObj;