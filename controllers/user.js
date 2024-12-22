const User = require("../models/user.js");


module.exports.renderSignUpForm =  (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req,res) => {
    try{
        let{ username, email, password} = req.body;
        const newUser = new User({username, email, password});
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser);
        // to login immeadiately after signup
        req.logIn(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success","Sign Up successful");
            res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) =>{
    req.flash("success","Login successful, Welcome to StaySphere");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err){
            next(err);
        }
        else{
            req.flash("success", "You logged out successfully.")
            res.redirect("/listings");
        }
    })
};