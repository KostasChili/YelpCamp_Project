const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp-DB');

const db = mongoose.connection; // ?
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => { console.log("DB connected") });
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('working');
});

app.get('/home', (req, res) => {
    res.render('home.ejs');
});

app.get('/makecampground', async (req, res) => {
    
});

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});