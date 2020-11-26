var express 	= require("express"),
	router		= express.Router(),
	Patient		= require("../models/patient"),
	middleware	= require("../middleware"),
	User		= require("../models/user")
	
	
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

//Show medical Record
router.get("/:id", function(req,res){
	Patient.findById(req.params.id, function(err, patient){
		if(err){
			console.log(err);
		}
		else{
			res.render("./patient/show" ,{patient:patient});
		}
	});
});

//Edit Patient Details
router.get("/:id/edit", /*checkOwnership*/ function(req,res){
	Patient.findById(req.params.id, function(err, foundPatient){
		res.render("./patient/edit", {patient:foundPatient})
	});
});

//Update Patient
router.put(":/id", /*checkOwnership*/ function(req,res){
	Patient.findByIdAndUpdate(req.params.id, req.body.patient, function(err, updatedPatient){
		if(err){
			res.redirect("/patient");
		}
		else{
			res.redirect("/patient/"+req.params.id);
		}
	});
});

//Delete Patient
module.exports = router;