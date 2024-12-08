const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    //  storing the author information
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","successfully created new Review");
    res.redirect(`/listings/${id}`)
}

module.exports.deleteReview = async (req,res)=>{
    let {id , reviewId } = req.params;
    // here pull operator removes the reviews from the reviews array where id's are matched with reviewId
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","successfully Review deleted");
    res.redirect(`/listings/${id}`);
}