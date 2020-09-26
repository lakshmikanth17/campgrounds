var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	//is user logged in?
	if(req.isAuthenticated()){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Campground not found");
			//otherwise redirect.
			res.redirect("back")
		} else {
			//does user own the campground?
			if(foundCampground.author.id.equals(req.user._id)) {
				next();
			//if not redirect
			} else {
				req.flash("error", "You don't have access to do that");
				res.redirect("back")
			}
	
		}
	});
	} else {
		req.flash("error", "you need to be logged in to do that");
		res.redirect("back");
	}
  }


middlewareObj.checkCommentOwnership = function (req, res, next) {
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
				req.flash("error", "you don't have access to do that");
				res.redirect("back")
			}
	
		}
	});
	} else {
		req.flash("error", "you need to be logged in to do that");
		res.redirect("back");
	}
  }


middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	//req.flash(key, value);
	req.flash("error", "please login to do that.");
	res.redirect("/login");
}

module.exports = middlewareObj