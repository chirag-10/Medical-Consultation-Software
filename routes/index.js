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
	res.redirect("/patient")
});


// Auth Routes

//Register
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newPatient = new Patient({name:req.body.name, email:req.body.email}) ;
	newPatient.save();
	var newUser = new User({name : req.body.name, username : req.body.email, role:0});
	
	
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err.message);
			req.flash('error', err.message);
			return res.redirect("/register");
		}
	});
	/*passport.authenticate("local")(req,res,function(){
		res.redirect("/index");
	});	*/
	res.redirect("/login")
	
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
	return res.redirect("/index");
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged OUT");
	return res.redirect("/");
});

module.exports = router;