var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    Travel = require("./models/travel"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
    travelRoutes = require("./routes/travels"),
    indexRoutes = require("./routes/index")



// APP CONFIG
// mongoose.connect("mongodb://localhost:27017/gezinfo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
mongoose.connect("mongodb+srv://mert:mert@cluster0-ztbim.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
mongoose.set('useFindAndModify', false);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "pasword pasword pasword",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/travels", travelRoutes);
app.use("/travels/:id/comments", commentRoutes);

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Server Has Started!");
});