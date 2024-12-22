if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");//using mongo session store
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("connection to DB successful");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//mongoAtlas session store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*60*60, //session updation time in seconds when no changes are made
});

store.on("error",() => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}


// app.get("/", (req,res) =>{
//     res.send("root working successsfully");
// })

app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to pass message in flash
app.use((req,res,next) => {
    res.locals.success = req.flash("success"); 
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // returns user details if logged in
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

//error handling page
app.use((err,req,res,next) =>{
    let{status=500, message="some error occured!"} = err;
    res.status(status).render("errors/error.ejs", {err});
})

app.listen(3000, () => {
    console.log("listening on port 3000");
})