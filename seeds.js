var mongoose = require("mongoose");
var Travel = require("./models/travel");
var Comment = require("./models/comment");

var data = []

function seedDB() {
    //Remove all travels
    Travel.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed travels!");
        Comment.deleteMany({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!");
            //add a few travels
            data.forEach(function (seed) {
                Travel.create(seed, function (err, travel) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a travel");
                        //create a comment
                        Comment.create({
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                travel.comments.push(comment);
                                travel.save();
                                console.log("Created new comment");
                            }
                        });
                    }
                });
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;