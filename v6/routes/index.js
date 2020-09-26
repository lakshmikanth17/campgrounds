

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
router.get("/register", function(req,res){
	res.render("register");
});

//handle sign up login
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err)
			return res.render("register")
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		
	});
});

});	

//show login form
router.get("/login", function(req, res){
	res.render("login");
});



router.post("/login", passport.authenticate("local", 
	{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req,res){
	
});


//logout route
router.get("/logout", function(req,res){
	req.logout();
	res.redirect("/campgrounds");
});

//middleware function
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;