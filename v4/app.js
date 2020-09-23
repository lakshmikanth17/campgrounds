var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
	passport   = require("passport"),
	LocalStrategy=require("passport-local"),
	Campground = require("./models/campground"),
	Comment	   = require("./models/comment"),
	User	   = require("./models/user"),
	seedDB	   = require("./seeds");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Greatest of all time",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

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


app.get("/", function(req,res){
	res.render("landing");
});

//INDEX Route- Show all campgrounds
app.get("/campgrounds", function(req,res){
	console.log(req.user);
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
		}
	});
	
	
});
//CREATE Route- add new campground
app.post("/campgrounds", function(req,res){
		//get form data and add to campgrounds array.
	var name= req.body.name;
	var image= req.body.image;
	var desc= req.body.description;
	var newCampground = {name:name , image:image, description:desc}
	//create a new campground and move to db
	Campground.create(newCampground, function(err, newlyCreated){
			if(err){
		console.log(err);
	} else {
	//redirect to campgrounds page.
	res.redirect("/campgrounds"); } 
	});
	
	}); 
	
//NEW Route- show form page to create a new campground
app.get("/campgrounds/new", function(req,res){
		res.render("campgrounds/new");
	});
//SHOW Route- show more info of one campground
app.get("/campgrounds/:id", function(req,res){
	 //find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
			if(err){
		console.log(err);
	} else {
		//render show template with that campground. 
	res.render("campgrounds/show", {campground: foundCampground});
	} 
	
	}); 

});


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Comment routes
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
//Find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
	//lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			})
		}
	})
})

//%%%%%%%%%%%%%%%%%%%%%%%%%
//AUTH ROUTES
//%%%%%%%%%%%%%%%%%%%%%%%%%
app.get("/register", function(req,res){
	res.render("register");
});

//handle sign up login
app.post("/register", function(req,res){
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
app.get("/login", function(req, res){
	res.render("login");
});



app.post("/login", passport.authenticate("local", 
	{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req,res){
	
});


//logout route
app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(process.env.PORT = 3000, process.env.IP, function(){
	console.log("yelp camp server has started");
});