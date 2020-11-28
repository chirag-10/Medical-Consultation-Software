var express 		= require("express"),
	router			= express.Router({mergeParams:true}),
	Patient			= require("../models/patient"),
	middleware		= require("../middleware"),
	User			= require("../models/user"),
	Medical_Records	= require("../models/med_records")
	
	
	
//show Patient Dashboard
router.get("/", middleware.isLoggedIn, function(req,res){
	Patient.findOne({'email' : req.user.username}, function(err, allPatients) {
		if(err){
			console.log(err);
		}
		else{
			res.render("./patient/index",{patient:allPatients, user:req});
		}
	});
});



//Show Patient Details
router.get("/:id", middleware.isLoggedIn, function(req,res){
	Patient.findById(req.params.id).populate("medical_record").exec(function(err, patient){
		if(err){
			console.log(err);
		}
		else{
			res.render("./patient/show" ,{patient:patient});
		}
	});
});


module.exports = router;