const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.createUser = async (req,res)=>{
    try{
        let {username, email, password} =req.body;
        let newUser =  new User({username,email});
        let registerdUser = await User.register(newUser,password);
        console.log(registerdUser);
        req.login(registerdUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User was successfully registered");
            res.redirect("/listings")
        })
        
    } catch(e) {
        req.flash("error","A user with the given Username is already Registerd")
        res.redirect("/signup")
    }        
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.loginUser = async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust")
    let redirectUrl = res.locals.redirectUrl;
    console.log(res.locals.redirectUrl);
    if(redirectUrl){
        res.redirect(res.locals.redirectUrl);
    } else {
        res.redirect("/listings")
    }
    
}

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully you are logged out!");
        res.redirect("/listings")
    })
} 