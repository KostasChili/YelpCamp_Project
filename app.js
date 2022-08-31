const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride=require('method-override');

mongoose.connect('mongodb://localhost:27017/yelp-camp-DB');

const db = mongoose.connection; // ?
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => { console.log("DB connected") });
const app = express();

app.use(methodOverride('_method'))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('working');
});

app.get('/home', (req, res) => {
    res.render('home.ejs');
});

app.get('/campgrounds', async (req, res) => {
const campgrounds=await Campground.find({});
res.render('campgrounds/index.ejs',{campgrounds});
});

app.get('/campgrounds/:id',async (req,res)=>{
const {id}= req.params;
const camp=await Campground.findById(id);
res.render('campgrounds/show',{camp});
});



app.listen(port, () => {
    console.log(`server running at port ${port}`);
});