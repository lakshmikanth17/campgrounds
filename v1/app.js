var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
		{name: "Triund Camp", image: "https://britishbrothers.com/wp-content/uploads/2019/01/triund-trek-500x500.jpg"},
		{name: "Parwathi Valley", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQGjgGOdmwtv5K1X356BnAAIf50bANwRLcSgw&usqp=CAU"},
		{name: "Chader Camp", image: "https://blog.terraintravellers.com/wp-content/uploads/2016/10/1-DSC_0264-1024x682.jpg"}
	];

app.get("/", function(req,res){
	res.render("landing");
});

app.get("/campgrounds", function(req,res){
	
	res.render("campgrounds", {campgrounds, campgrounds});
});

app.post("/campgrounds", function(req,res){
		//get form data and add to campgrounds array.
	var name= req.body.name;
	var image= req.body.image;
	var newCampground = {name:name , image:image}
	campgrounds.push(newCampground);
	

	//redirect to campgrounds page.
	res.redirect("/campgrounds");

});

app.get("/campgrounds/new", function(req,res){
		res.render("new.ejs");
		});

app.listen(process.env.PORT = 3000, process.env.IP, function(){
	console.log("yelp camp server has started");
});