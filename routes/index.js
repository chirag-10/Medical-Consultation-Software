var express 		= require("express"),
	router			= express.Router(),
	User			= require("../models/user"),
	middleware		= require("../middleware"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	Patient			= require("../models/patient")



router.get('/', function(req,res){
	res.render("landing");
});

router.get('/index', middleware.isLoggedIn, function(req,res){
	Patient.find({}, function(err, allPatients) {
		if(err){
			console.log(err);
		}
		else{
			res.render("./patient/index",{patients:allPatients});
		}
	});
});

router.get('/admin', middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	res.render("admin");
});


// Auth Routes

//Register
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newUser = new User({username : req.body.email, role:1})
	
	
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err.message);
			req.flash('error', err.message);
			 res.redirect("/register");
		}
		Patient.create({name:req.body.name, age:req.body.age, gender:req.body.gender , user:user._id});

		passport.authenticate("local")(req,res,function(){
			return res.redirect("/index");
		});
	});
	
	
	
});

//Login

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect : '/index',
		failureRedirect : '/login'
	}) , function(req, res){	
	res.redirect("/index")
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged OUT");
	res.redirect("/");
});

module.exports = router;