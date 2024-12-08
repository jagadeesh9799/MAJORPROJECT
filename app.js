if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}


console.log(process.env.SECRET);

const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session")
const MongoStrote = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//  these are for routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const port = 8080;

const app = express();

const dbUrl = process.env.ATLAS_CONNECTION_STRING;

main()
    .then(()=>{
        console.log("connection successful");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

const store = MongoStrote.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    // how much time after session will be updated
    touchAfter: 24*60*60
});

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE", err)
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        // here cookie will be automatically expired
        expires:Date.now() +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};



// related to  sessions
app.use(session(sessionOptions));
app.use(flash());

// related to authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// related to flash messages
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.use((req, res, next) => {
//     console.log(`${req.method} request received at ${req.url}`);
//     next();
// });

// related to routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


// related to errors
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
})

app.listen(port,()=>{
    console.log("server is listening to port:",port);
})