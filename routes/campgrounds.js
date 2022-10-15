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



//custom middleware
const {isAuthor,isLoggedIn,validateCampground} = require('../middleware');

//index route containing all campgrounds in db
router.get('/',catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds});
}));



//create new campground route - Serves the form to create a new campground via get request
router.get('/new',isLoggedIn,(req, res) => {
    res.render('campgrounds/new');
});


//details page route via campground ID
router.get('/:id', catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    });
    if(!campground)
    {
        req.flash('error','cannot find campground')
        res.redirect('/campgrounds')
    }
    else
    res.render('campgrounds/show', { campground });
}));


//creates and saves the new camp ground via post request from a form
router.post('/',isLoggedIn,validateCampground,catchAsync(async(req,res)=>{
const campgounrd = new Campground(req.body.campgounrd);
campgounrd.author=req.user._id();
await campgounrd.save();
req.flash('success',`campground ${campgounrd.title}, was creted successfully`);
res.redirect(`/campgrounds/${id}`);

}));

//edit campground route - Serves the form to edit via get request
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
   if(!campground)
   {
    req.flash('error',"Cannot find Campground");
    return res.redirect("/campgrounds");
   }
   res.render('campgrounds/edit.ejs',{campground});
}));

//update route that updates the campground in the db via url encoded data
router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync( async (req, res) => {
    const {id} = req.params;
    const campground =  await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${id}`);
}));

//delete path , takes the id of a campground finds it and deletes it from the db
router.delete("/:id",isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
const {id}=req.params;
const deletedCampground=await Campground.findByIdAndDelete(id);
req.flash('success','Successfully deleted Campground');
res.redirect('/campgrounds');
}));


module.exports = router;