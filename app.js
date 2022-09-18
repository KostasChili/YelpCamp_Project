const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const { urlencoded } = require('express');
const campground = require('./models/campground');
const { findByIdAndDelete } = require('./models/campground');
const ejsMate= require('ejs-mate');
const { ppid } = require('process');
const catchAsync=require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');

mongoose.connect('mongodb://localhost:27017/yelp-camp-DB');

const db = mongoose.connection; // ?
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => { console.log("DB connected") });
const app = express();


//use of method override package
app.use(methodOverride('_method'));

//middlewere parses the urlencoded  payload
app.use(express.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');

app.get('/home',(req,res)=>{
    res.send('Home');
});

//index route containing all campgrounds in db
app.get('/campgrounds',catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
}));


//create new campground route - Serves the form to create a new campground via get request
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});


//details page route via campground ID
app.get('/campgrounds/:id', catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
}));


//creates and saves the new camp ground via post request from a form
app.post('/campgrounds', catchAsync( async (req, res,next) => {
    if(!req.body.campground) throw new ExpressError('Invalid campground data',400);
    const campground = new Campground(req.body.campground);
    console.log(campground.title);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

//edit campground route - Serves the form to edit via get request
app.get('/campgrounds/:id/edit', catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { campground });
}));

//update route that updates the campground in the db via url encoded data
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${updatedCampground._id}`)
});

//delete path , takes the id of a campground finds it and deletes it from the db
app.delete("/campgrounds/:id",catchAsync(async(req,res)=>{
const {id}=req.params;
const deletedCampground=await Campground.findByIdAndDelete(id);
res.redirect('/campgrounds');
}));

//404 show route this will run if no other route is hit ORDER MATTERS
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
});

//error handlers


app.use((err,req,res,next)=>{
    const {statusCode=500}= err;
    if(!err.message) 
    err.message='Somethings wrong I can feel it';
    res.status(statusCode).render('error',{err});
});


//run the server

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});