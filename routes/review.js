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
const {isLoggedIn,validateReview, isAuthor, isRevAuthor} = require('../middleware');

//controllers
const reviews = require('../controllers/reviews');

//post path  to create a review
router.post('/',isLoggedIn,validateReview,catchAsync(reviews.postReviews));

//delete path for a review
router.delete('/:reviewId',isLoggedIn,isRevAuthor,catchAsync(reviews.destroyReview));

module.exports = router;