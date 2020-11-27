var express 		= require("express"),
	router			= express.Router(),
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


router.post("/:id", middleware.isLoggedIn, function(req,res){
	Patient.findById(req.params.id, function(err, patient){
		if(err){
			console.log(err);
			res.redirect("/patient")
		}
		else{
			var medRec = req.body.medRec;
			medRec.name = patient.name;

			Medical_Records.create(medRec, function(err, medRec){
				if(err){
					console.log(err);
				}
				else{
					medRec.save();
					patient.medical_record = medRec;
					patient.save();
					console.log(medRec);
					res.redirect("/patient/" + patient._id)
				}
			})
		}
	});
});

router.get("/:id/new", function(req, res){
	Patient.findById(req.params.id , function(err, patient) {
		if(err){
			console.log(err);
		}
		else{
			res.render("./patient/new",{patient:patient});
		}
	});
});

//Show medical Record
router.get("/:id", function(req,res){
	Patient.findById(req.params.id).populate("medical_record").exec(function(err, patient){
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
	Patient.findById(req.params.id).populate("medical_record").exec(function(err, foundPatient){
		res.render("./patient/edit", {patient_id:req.params.id ,record:foundPatient.medical_record})
	});
});

//Update Patient
router.put("/:id/:record_id", /*checkOwnership*/ function(req,res){
	Medical_Records.findByIdAndUpdate(req.params.id, req.body.medRec, function(err, updatedRecord){
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