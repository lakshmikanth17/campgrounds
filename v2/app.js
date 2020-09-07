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
	image: String
});

var Campground = mongoose.model ("Campground", campgroundSchema);



app.get("/", function(req,res){
	res.render("landing");
});

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

app.post("/campgrounds", function(req,res){
		//get form data and add to campgrounds array.
	var name= req.body.name;
	var image= req.body.image;
	var newCampground = {name:name , image:image}
	//create a new campground and move to db
	Campground.create(newCampground, function(err, newlyCreated){
			if(err){
		console.log(err);
	} else {
					  	//redirect to campgrounds page.
	res.redirect("/campgrounds");					  }
				});
	});
	

app.get("/campgrounds/new", function(req,res){
		res.render("new.ejs");
		});

app.listen(process.env.PORT = 3000, process.env.IP, function(){
	console.log("yelp camp server has started");
});