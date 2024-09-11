const mongoose = require("mongoose");
const Review  = require("../models/review.js");
const Listing  = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
   
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Trim any extra whitespace from reviewId
    reviewId = reviewId.trim();

    // Validate the reviewId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        req.flash("error", "Invalid Review ID!");
        return res.redirect(`/listings/${id}`);
    }

    const reviewObjectId = new mongoose.Types.ObjectId(reviewId);

    // Remove the review from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewObjectId } });

    // Delete the review document
    await Review.findByIdAndDelete(reviewObjectId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}