if(process.env.NODE_ENV!=='production')
{
    require('dotenv').config({path:'.env'});
}
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
//mongoDBstore
const MongoStore=require('connect-mongo');

//passport
const passport = require('passport');
const localStrategy = require('passport-local');
const User  = require('./models/user');

//helmet
const helmet =require('helmet');

//mongo connection
//'mongodb://localhost:27017/yelp-camp-DB'
const dbUrl = process.env.MONGO_URL;
mongoose.connect(dbUrl);
const db = mongoose.connection; 

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


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css",
    "https://cdn.jsdelivr.net" 
]
;
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css"
];
const fontSrcUrls = [];
 app.use(
     helmet.contentSecurityPolicy({
         directives: {
            defaultSrc: [],
             connectSrc: ["'self'", ...connectSrcUrls],
             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
             workerSrc: ["'self'", "blob:"],
             objectSrc: [],
             imgSrc: [
                 "'self'",
                  "blob:",
                 "data:",
                 "https://res.cloudinary.com/dq4xdfc6v/", 
                 "https://images.unsplash.com/",
               
             ],
             fontSrc: ["'self'", ...fontSrcUrls],
         },
     })
 );



const secret = process.env.SECRET;
//session setup
const sessionConfig = {
    store:MongoStore.create({
     mongoUrl:dbUrl || "mongodb://localhost:27017/yelp-camp-DB", //atlas || local
     secret:secret || 'thishloudhavebeenabettersecret',
     //in express-session>=1.10.0 you dont want to resave tall the session on the db every single time, lazy update the session
     //by limiting a period of thime
     touchAfter:24*60*60   
    }),
    name:'session', 
    secret:secret || 'thishloudhavebeenabettersecret', 
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true, //when this flag is set the script cannot be accessed by client side scripts.
        //secure:true, //this cookie works only on https
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