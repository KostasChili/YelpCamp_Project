const express = require('express');
const router = express.Router();

const ExpressError = require('../utilities/ExpressError');
const catchAsync=require('../utilities/catchAsync');
//models
const Campground = require('../models/campground');
const Review  = require('../models/review');
const User = require('../models/user');

//JOI schema
const {campgroundSchema} = require('../schemas.js')
//login
const campground = require('../models/campground');

//
const campgrounds = require('../controllers/campgrounds');


//custom middleware
const {isAuthor,isLoggedIn,validateCampground} = require('../middleware');

//index route containing all campgrounds in db
router.get('/',catchAsync(campgrounds.index));

//create new campground route - Serves the form to create a new campground via get request
router.get('/new',isLoggedIn,campgrounds.newRenderForm);


//details page route via campground ID
router.get('/:id', catchAsync(campgrounds.show));


//creates and saves the new camp ground via post request from a form
router.post('/',isLoggedIn,validateCampground,catchAsync(campgrounds.new));

//edit campground route - Serves the form to edit via get request
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.editRenderForm));

//update route that updates the campground in the db via url encoded data
router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.edit));

//delete path , takes the id of a campground finds it and deletes it from the db
router.delete("/:id",isLoggedIn,isAuthor,catchAsync(campgrounds.delete));


module.exports = router;