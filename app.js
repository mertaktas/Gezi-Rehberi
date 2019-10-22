var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Travel = require("./models/travel"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")


// APP CONFIG
mongoose.connect("mongodb://localhost:27017/gezinfo", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
seedDB();



app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX
app.get("/travels", function (req, res) {
    Travel.find({}, function (err, allTravels) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                travels: allTravels
            });
        }
    });

});

app.post("/travels", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newTravel = {
        name: name,
        image: image
    }
    Travel.create(newTravel, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/travels");
        }
    });
});


// CREATE
app.get("/travels/new", function (req, res) {
    res.render("new");
});

// SHOW 
app.get("/travels/:id", function (req, res) {
    Travel.findById(req.params.id).populate("comments").exec(function (err, foundTravel) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {
                travel: foundTravel
            });
        }
    })
});


app.listen("3000", function () {
    console.log("Server Çalıştı...");
});