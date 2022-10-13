const mongoose = require('mongoose');
const { authenticate } = require('passport');
const Campground = require('./models/campground');
const review = require('../models/review.js');
const cities = require('./cities');
const {places,descriptors}= require('./seedhelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp-DB');

const db=mongoose.connection;

db.on('error',console.error.bind(console,'connection error :'));
db.once('open',()=>{
    console.log('Connected to DB from seeds folder');
});

const sample=array=>array[Math.floor(Math.random()*array.length)] // passes in an array and return a random value from that array

//the following function creates loops over and every time it creates a random number from 0-1000( we have one thousand cities in cities file) and then uses
//that random number to pull a random city and state from the cities file. Then it creates a campground with that set of data and saves it to the db
//this proccess happens as many itterations as we want
const seedDB=async()=>{
    await Campground.deleteMany({}); //before seeding fake data into db delete all the older data
    
    for(let i=0;i<50;i++)
    {
        const rand1000=Math.floor(Math.random()*1000);
        const randPrice=Math.floor(Math.random()*20+10);
        const camp= new Campground({
            location:`${cities[rand1000].city},${cities[rand1000].state}`,
            title:`${sample(places)} ${sample(descriptors)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:"RandomText is a tool designers and developers can use to grab dummy text in either Lorem Ipsum or Giberish format. The API lets developers integrate random text generation into a CMS. The API offers parameters that let the user choose the type and number of elements and number of words.",
            price:randPrice,
            review:[{}],
            author:'634427f17d98cd10413f0814'
        });
        await camp.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
    console.log('Disconected from db from seeds folder');
}).catch(err=>{
    console.log('Error disconecting from db from seeds folder');
    console.log(err);
})

