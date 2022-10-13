const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const passport = require("passport");
const { isLoggedIn } = require("../middleware/auth");

router.get("/register", (req, res) => {
  res.render("users/register.ejs");
});

router.post("/register",catchAsync(async (req, res,next) => {
    try {
      const { email, username, password } = req.body;
      const user = await new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser,err=>{
        if(err) {return next();}
      
      req.flash("success", `Welcome to Yelp Camp ${registeredUser.username}`);
      res.redirect("/campgrounds");
    })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  }));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

//pass authenticate is a middleware provided by passport
router.post("/login",passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash("success", `wellcome ${req.body.username}`);
    res.redirect(redirectUrl);
  });

  router.get('/logout', (req,res)=>{
     req.logout(function(err){
      if(err){
        return next(err)
      }
      req.flash('success','You where logged out successfully');
      res.redirect('/campgrounds');
     });
  });

module.exports = router;
