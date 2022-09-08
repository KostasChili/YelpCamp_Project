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

mongoose.connect('mongodb://localhost:27017/yelp-camp-DB');

const db = mongoose.connection; // ?
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => { console.log("DB connected") });
const app = express();



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
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
});


//create new campground route - Serves the form to create a new campground via get request
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});


//details page route via campground ID
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
});


//creates and saves the new camp ground via post request from a form
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

//edit campground route - Serves the form to edit via get request
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { campground });
});

//update route that updates the campground in the db via url encoded data
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    console.log(updatedCampground);
    res.redirect(`/campgrounds/${updatedCampground._id}`)
});

app.delete("/campgrounds/:id",async(req,res)=>{
const {id}=req.params;
const deletedCampground=await Campground.findByIdAndDelete(id);
res.redirect('/campgrounds');
});

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});