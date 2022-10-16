const User = require('../models/user');
const passport = require('passport');



module.exports.registerRenderForm =(req, res) => {
    res.render("users/register.ejs");
}


module.exports.createUser = async (req, res,next) => {
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
}

module.exports.loginRenderForm= (req, res) => {
    res.render("users/login.ejs");
}

module.exports.loginPost =(req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash("success", `wellcome ${req.body.username}`);
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res)=>{
  req.logout();
  req.flash('success','You where logged out successfully');
  res.redirect('/campgrounds');
}

