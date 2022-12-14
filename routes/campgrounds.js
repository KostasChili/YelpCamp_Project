if(process.env.NODE_ENV !=='production')
{
    require('dotenv').config();
}


const express = require('express');
const router = express.Router();
//Multer
const multer = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage});


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


//grouped routes
router.route('/')
.get(catchAsync(campgrounds.index)) //index route for campgrounds
.post(isLoggedIn,upload.array('campground[image]'),validateCampground,catchAsync(campgrounds.new)); //create campground



//create new campground route - Serves the form to create a new campground via get request
router.get('/new',isLoggedIn,campgrounds.newRenderForm);

router.route('/:id')
.get( catchAsync(campgrounds.show))//campgrounds details page
.put(isLoggedIn,isAuthor,upload.array('campground[image]'),validateCampground,catchAsync(campgrounds.edit))//update route for campgrounds
.delete(isLoggedIn,isAuthor,catchAsync(campgrounds.delete))//delete route for campgrounds


//edit campground route - Serves the form to edit via get request
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.editRenderForm));


module.exports = router;