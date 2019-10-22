var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
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

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "pasword pasword pasword",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX
app.get("/travels", function (req, res) {
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

app.post("/travels", function (req, res) {
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


// CREATE
app.get("/travels/new", function (req, res) {
    res.render("travels/new");
});

// SHOW 
app.get("/travels/:id", function (req, res) {
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

//COMMENTS ROUTES


app.get("/travels/:id/comments/new", isLoggedIn, function (req, res) {
    // find travel by id
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

app.post("/travels/:id/comments", isLoggedIn, function (req, res) {
    //lookup campground using ID
    Travel.findById(req.params.id, function (err, travel) {
        if (err) {
            console.log(err);
            res.redirect("/travels");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    travel.comments.push(comment);
                    travel.save();
                    res.redirect('/travels/' + travel._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function (req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/travels");
        });
    });
});

// show login form
app.get("/login", function (req, res) {
    res.render("login");
});
// handling login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/travels",
    failureRedirect: "/login"
}), function (req, res) {});

// logic route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/travels");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen("3000", function () {
    console.log("Server Çalıştı...");
});