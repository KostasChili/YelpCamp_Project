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
//express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
//flash
const flash = require('connect-flash');


//passport
const passport = require('passport');
const localStrategy = require('passport-local');
const User  = require('./models/user');

//mongo connection
mongoose.connect('mongodb://localhost:27017/yelp-camp-DB');
const db = mongoose.connection; // ?
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => { console.log("DB connected") });
const app = express();

//use sanitizer
// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query
// To remove data using these defaults:
app.use(mongoSanitize());

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


//use of method override package
app.use(methodOverride('_method'));

//middlewere parses the urlencoded  payload
app.use(express.urlencoded({ extended: true }));

//use passport
app.use(passport.initialize());
app.use(passport.session()); //in order to use percistent loggin sessions Must be used before app.use(session)
passport.use (new localStrategy(User.authenticate())); //authenticate genarates a function that is used in Passports local strategy. Its on the user Model
passport.serializeUser(User.serializeUser());//serilization referse to how we store a user in the session
passport.deserializeUser(User.deserializeUser());//how you remove a user from the session



//view engine and ejs
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//flash messages middleware
app.use((req,res,next)=>{
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//express router
const campgroundsRouter =require('./routes/campgrounds');
const reviewRouter = require ('./routes/review');
app.use('/campgrounds',campgroundsRouter);
app.use('/campgrounds/:id/review',reviewRouter);
const usersRouter = require('./routes/users')
app.use('/',usersRouter);
app.use(express.static(path.join(__dirname,'public')));


//simple home page
app.get('/home',(req,res)=>{
    res.render('home.ejs')
})

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

//in a hosting environment the port is dynamically asigned
//we use environment viriables
const port = process.env.PORT || 3000;

//run the server
app.listen(port, () => {
    console.log(`server running at port ${port}`);
});