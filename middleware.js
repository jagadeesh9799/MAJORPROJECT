const Listing = require("./models/listing")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // here user tried to add new listing but he is not logged in so we redirected him 
        // to login page but after login he should redirected to the listing creation page so we are saving the original link information
        // but after login passport automatically reset the session so we need to create anothe middleware and store in the locals
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must logged in to create a Listing")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let editedListing = req.body.listing;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of the listing") 
        res.redirect(`/listings/${id}`)
    }

    next();
}

// by passing this as parameter we can convert schema validation using joi to a middleware
module.exports.validateListing = (req,res,next)=>{
    // validating each and every feild is present or not
    let {error} = listingSchema.validate(req.body);
        if(error){
            console.log(error);
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400, errMsg)
        } else {
            next();
        }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
        if(error){
            console.log(error);
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400, errMsg)
        } else {
            next();
        }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the author of the Review") 
        return res.redirect(`/listings/${id}`)
    }

    next();
}