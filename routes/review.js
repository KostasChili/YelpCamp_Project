const express = require('express');
const router = express.Router({mergeParams:true});

//models
const Campground = require('../models/campground');
const Review  = require('../models/review');

//utils
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

// JOI schemas
const {reviewSchema} = require('../schemas');

//custom middleware
const {isLoggedIn,validateReview} = require('../middleware');



//post path  to create a review
router.post('/',isLoggedIn,validateReview,catchAsync( async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash('success','Review created successfully')
    res.redirect(`/campgrounds/${id}`);
}));

//delete path for a review
router.delete('/:reviewId',isLoggedIn,catchAsync(async(req,res)=>{
const {reviewId} = req.params;
const {id} = req.params;
const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
const review = await Review.findByIdAndDelete(reviewId);
req.flash('sucess','Successfully deleted Review');
res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;