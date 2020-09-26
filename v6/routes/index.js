//Campground.create(
//{
	//name: "Goecha La Camp",
	//i//mage: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_mgzdhCGJ0nfNSKc6h7z1Vakjr98MhBHhRA&usqp=CAU",
	//description: "Difficulty: Difficult; Max Altitide:15,100ft",
//},
  //function(err, campground){
	  //if(err){
		  //console.log(err);
	  //} else {
		  //console.log("newly created campground");
		  //console.log(campground);
	  //}
  //});
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req,res){
	res.render("landing");
});

//%%%%%%%%%%%%%%%%%%%%%%%%%
//AUTH ROUTES
//%%%%%%%%%%%%%%%%%%%%%%%%%


// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up login
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
    		console.log(err);
    		return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp" + user.username);
			res.redirect("/campgrounds");
		
	});
});

});	

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//login logic
router.post("/login", passport.authenticate("local", 
	{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req,res){
	
});


//logout route
router.get("/logout", function(req,res){
	req.logout();
	//req.flash(key, value);
	req.flash("success", "logged you out");
	res.redirect("/campgrounds");
});



module.exports = router;