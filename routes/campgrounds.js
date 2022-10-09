const express = require('express');
const router = express.Router();

const ExpressError = require('../utilities/ExpressError');
const catchAsync=require('../utilities/catchAsync');
//models
const Campground = require('../models/campground');
const Review  = require('../models/review')

//JOI schema
const {campgroundSchema} = require('../schemas.js')

//validator for campground
const validateCampground=(req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

//index route containing all campgrounds in db
router.get('/',catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds});
}));




//create new campground route - Serves the form to create a new campground via get request
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});


//details page route via campground ID
router.get('/:id', catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground)
    {
        req.flash('error','cannot find campground')
        res.redirect('/campgrounds')
    }
    else
    res.render('campgrounds/show', { campground });
}));


//creates and saves the new camp ground via post request from a form

router.post('/',validateCampground,catchAsync( async (req, res,next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Campground created successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//edit campground route - Serves the form to edit via get request
router.get('/:id/edit', catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { campground });
}));

//update route that updates the campground in the db via url encoded data
router.put('/:id',validateCampground,catchAsync( async (req, res,next) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','Successfully updated campground')
    res.redirect(`/campgrounds/${updatedCampground._id}`)
}));

//delete path , takes the id of a campground finds it and deletes it from the db
router.delete("/:id",catchAsync(async(req,res)=>{
const {id}=req.params;
const deletedCampground=await Campground.findByIdAndDelete(id);
req.flash('success','Successfully deleted Campground');
res.redirect('/campgrounds');
}));


module.exports = router;