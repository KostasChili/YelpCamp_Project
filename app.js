//express
const express = require('express');
const path = require('path');
const ExpressError = require('./utilities/ExpressError');
const session = require('express-session');
//mongoose
const mongoose = require('mongoose');
//packages and middleware
const methodOverride = require('method-override'); //method overide to create DELETE requests from forms
const { urlencoded } = require('express');  //middleware a build in method of express to recognize incoming Request Obj as strings or Arrays
const ejsMate= require('ejs-mate');       
const Joi = require ('joi');               //schema description and validator 
const { ppid } = require('process');
//?????????
const { findByIdAndDelete, validate } = require('./models/campground');
//flash
const flash = require('connect-flash');
const port = 3000;

//mongo connection
mongoose.connect('mongodb://localhost:27017/yelp-camp-DB');
const db = mongoose.connection; // ?
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => { console.log("DB connected") });
const app = express();

//use flash
app.use(flash());



//session setup
const sessionConfig = {
    secret:'this should be a better secret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true, //when this flag is set the script cannot be accessed by client side scripts.
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        

    }
    //default memory Store only for development mode
    //store:mongo for later
}
app.use(session(sessionConfig));

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//use of method override package
app.use(methodOverride('_method'));

//middlewere parses the urlencoded  payload
app.use(express.urlencoded({ extended: true }))

//view engine and ejs
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');

//express router
const campgroundsRouter =require('./routes/campgrounds');
const reviewRouter = require ('./routes/review');
app.use('/campgrounds',campgroundsRouter);
app.use('/campgrounds/:id/review',reviewRouter);
app.use(express.static(path.join(__dirname,'public')));

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