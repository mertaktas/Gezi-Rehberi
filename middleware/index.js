var Travel = require("../models/travel");
var Comment = require("../models/comment");

// all the middleware

var middlewareObj = {

};

middlewareObj.checkTravelOwnership = function (req, res, next) {
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

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
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

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;