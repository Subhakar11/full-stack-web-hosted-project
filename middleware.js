const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema , reviewSchema}  = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn  = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
       return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl  = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req , res ,next) =>{
    const { id } = req.params;

    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
       return  res.redirect(`/listings/${id}`);
    }
next();
}
// module.exports.isReviewAuthor = async(req , res ,next) =>{
//     const { id, reviewId } = req.params;

//     let review = await Review.findById(reviewId);
//     if(!review.author.equals(res.locals.currUser._id)){
//         req.flash("error", "You are not the author of this review");
//        return  res.redirect(`/listings/${id}`);
//     }
// next();
// }



const mongoose = require("mongoose");

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    // Trim any extra whitespace from reviewId
    reviewId = reviewId.trim();

    // Validate the reviewId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        req.flash("error", "Invalid Review ID!");
        return res.redirect(`/listings/${id}`);
    }

    // Find the review and check if the current user is the author
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};




module.exports.validateListing = (req, res, next) => {
    // console.log(req.body);  // Debugging line

    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Invalid request data");
    }

    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};




module.exports.validateReview = (req,res, next) =>{
    let {error} = reviewSchema.validate(req.body);
 
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}