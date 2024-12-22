const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;// to specify author
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    // console.log(listing.reviews);
    //to pass message in flash
    req.flash("success", "New review created successfully.")
    res.redirect(`/listings/${listing._id}`)
};

module.exports.deleteReview = async (req,res) =>{
    let { id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    //to pass message in flash
    req.flash("success", "Review deleted successfully.")
    res.redirect(`/listings/${id}`);
};