var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
	

router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
//Find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
	//lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and id to comments
					comment.author.id = req.user._id ;
					comment.author.username = req.user.username; 
					
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//edit comment route
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})
	
});


//comment update route (put request)
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership,  function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});


//comment destroy route

router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//middleware function

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


function checkCommentOwnership(req, res, next) {
	//is user logged in?
	if(req.isAuthenticated()){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			//otherwise redirect.
			res.redirect("back")
		} else {
			//does user own the comment?
			if(foundComment.author.id.equals(req.user._id)) {
				next();
			//if not redirect
			} else {
				res.redirect("back")
			}
	
		}
	});
	} else {
		console.log("login first");
		res.redirect("back");
	}
}


module.exports = router;