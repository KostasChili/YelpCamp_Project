module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; // allows us to return the user to the page he was viewing earlier
        req.flash('error','You must sign in first');
       return res.redirect('/login');
    }
    next();
}
