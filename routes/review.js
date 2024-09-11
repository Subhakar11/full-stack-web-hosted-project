const express  = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({mergeParams: true});
const {validateReview ,isLoggedIn, isReviewAuthor} = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews.js");

// Post Reviews Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));


// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

module.exports = router;