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


//validator for rating
const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    
    if(error){
        
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else
    next();
}

//post path  to create a review
router.post('/',validateReview,catchAsync( async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Review created successfully')
    res.redirect(`/campgrounds/${id}`);
}));

//delete path for a review
router.delete('/:reviewId',catchAsync(async(req,res)=>{
const {reviewId} = req.params;
const {id} = req.params;
const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
const review = await Review.findByIdAndDelete(reviewId);
req.flash('sucess','Successfully deleted Review');
res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;