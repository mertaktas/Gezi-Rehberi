const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    Travel = require("./models/travel"),
    Comment = require("./models/comment"),
    User = require("./models/user")

// Routes File
const commentRoutes = require("./routes/comments"),
    travelRoutes = require("./routes/travels"),
    indexRoutes = require("./routes/index")

// Local Database
// mongoose.connect("mongodb://localhost:27017/gezinfo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// Public Database
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
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use("/", indexRoutes);
app.use("/travels", travelRoutes);
app.use("/travels/:id/comments", commentRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server Has Started port : ${port}`);
});