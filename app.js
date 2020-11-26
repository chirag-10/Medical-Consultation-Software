var express   		= require("express"),
	app	      		= express(),
	path			= require("path"),
	passport  		= require("passport"),
	LocalStrategy	= require("passport-local"),
	mongoose		= require("mongoose"),
	bodyParser		= require("body-parser"),
	User			= require("./models/user"),
	flash			= require("connect-flash"),
	middleware		= require("./middleware"),
	methodOverride	= require("method-override"),
	favicon 		= require("serve-favicon")
	
//Requiring Routes
var patientRoutes 	= require("./routes/patient");
var indexRoutes		= require("./routes/index");



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(favicon(path.join(__dirname,'public','favicon.ico')));


//Passport Config
app.use(require("express-session")({
	secret : "Secret KEY",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser 	= req.user;
	res.locals.error		= req.flash.error;
	res.locals.success		= req.flash.success;
	next();
});

app.use("/patient",patientRoutes);
app.use("/", indexRoutes);





app.listen(5000, function(){
	console.log("Starting Server at http://localhost:5000")
});