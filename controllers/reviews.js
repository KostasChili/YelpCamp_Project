//models
const Campground = require('../models/campground');
const Review = require('../models/review');


//post controller for reviews
module.exports.postReviews = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash('success','Review created successfully')
    res.redirect(`/campgrounds/${id}`);
}


//delete controller for reviews
module.exports.destroyReview=async(req,res)=>{
    const {reviewId} = req.params;
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('sucess','Successfully deleted Review');
    res.redirect(`/campgrounds/${id}`);
}