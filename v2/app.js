var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


//schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model ("Campground", campgroundSchema);
  
Campground.create(
{
	name: "Goecha La Camp",
	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_mgzdhCGJ0nfNSKc6h7z1Vakjr98MhBHhRA&usqp=CAU",
	description: "Difficulty: Difficult; Max Altitide:15,100ft",
},
  function(err, campground){
	  if(err){
		  console.log(err);
	  } else {
		  console.log("newly created campground");
		  console.log(campground);
	  }
  });


app.get("/", function(req,res){
	res.render("landing");
});

//INDEX Route- Show all campgrounds
app.get("/campgrounds", function(req,res){
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds", {campgrounds:allCampgrounds});
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
		res.render("new.ejs");
	});
//SHOW Route- show more info of one campground
app.get("/campgrounds/:id", function(req,res){
	 //find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground) {
			if(err){
		console.log(err);
	} else {
		//render show template with that campground. 
	res.render("show", {campground: foundCampground});
	} 
	
	}); 



});

app.listen(process.env.PORT = 3000, process.env.IP, function(){
	console.log("yelp camp server has started");
});