const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride=require('method-override');
const { urlencoded } = require('express');

mongoose.connect('mongodb://localhost:27017/yelp-camp-DB');

const db = mongoose.connection; // ?
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => { console.log("DB connected") });
const app = express();

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//index route containing all campgrounds in db
app.get('/campgrounds', async (req, res) => {
const campgrounds=await Campground.find({});
res.render('campgrounds/index.ejs',{campgrounds});
});


//create new campground route - Serves the form to create a new campground via get request
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});


//details page route via campground ID
app.get('/campgrounds/:id',async (req,res)=>{
const {id}= req.params;
const camp=await Campground.findById(id);
res.render('campgrounds/show',{camp});
});

//creates and saves the new camp ground via post request from a form
app.post('/campgrounds',async(req,res)=>{
const campground = new Campground(req.body.campground);
await campground.save();
res.redirect(`/campgrounds/${campground._id}`);
});

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});