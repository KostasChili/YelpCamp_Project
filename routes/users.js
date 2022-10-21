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

router.route('/register')
.get(users.registerRenderForm)
.post(catchAsync(users.createUser));

router.route('/login')
.get (users.loginRenderForm)
.post (passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginPost)


  // router.get('/logout', (req,res)=>{
  //    req.logout(function(err){
  //     if(err){
  //       return next(err)
  //     }
  //     req.flash('success','You where logged out successfully');
  //     res.redirect('/campgrounds');
  //    });
  // }); //STOPED WORKING 

  router.get('/logout',users.logout);

module.exports = router;
