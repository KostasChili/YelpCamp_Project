const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const { registerRenderForm } = require("../controllers/users");

//controllers
const users = require('../controllers/users');

router.get("/register",users.registerRenderForm);

router.post("/register",catchAsync(users.createUser));

router.get("/login",users.loginRenderForm);

//pass authenticate is a middleware provided by passport
router.post("/login",passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginPost)

  // router.get('/logout', (req,res)=>{
  //    req.logout(function(err){
  //     if(err){
  //       return next(err)
  //     }
  //     req.flash('success','You where logged out successfully');
  //     res.redirect('/campgrounds');
  //    });
  // }); STOPED WORKING 

  router.get('/logout',users.logout);

module.exports = router;
