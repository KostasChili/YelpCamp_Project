const Campground = require('./models/campground');
const ExpressError = require('./utilities/ExpressError')
const reviewSchema = require('./models/review');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; // allows us to return the user to the page he was viewing earlier
        req.flash('error','You must sign in first');
       return res.redirect('/login');
    }
    next();
}


module.exports.isAuthor =  async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground)
    {
        req.flash('error','Campground was not found');
        return req.redirect("/campgrounds");
    }
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error',"You don't have permission to do that !");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


//validator for campground
module.exports.validateCampground=(req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}


//validator for rating
module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    
    if(error){
        
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else
    next();
}


module.exports.isRevAuthor = async (req,res,next)=>{
    const {reviewId} = req.params;
    const {id} = req.params;
    const review = await reviewSchema.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You don't have permision to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();

}