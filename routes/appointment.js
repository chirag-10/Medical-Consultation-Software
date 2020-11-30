const { all } = require("./patient");

var express     = require("express"),
    router      = express.Router({mergeParams:true}),
    Appointment = require("../models/appointment"),
    Patient     = require("../models/patient"),
    Doctor      = require("../models/doctor"),
    middleware  = require("../middleware")


//new Appointment
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("./appointment/new", {patient_id : req.params.id});
});    


router.post("/", middleware.isLoggedIn, function(req,res){
    Appointment.find({date:req.body.time}, function(err, appointment){
        if(err){
            console.log(err);
            return res.redirect('/patient');
        }
        if(appointment.length > 0){

            req.flash("error", "This appointment slot is booked. Please try another");
            return res.redirect('/patient');
        }
        Doctor.findOne({name:req.body.name}, function(error,doctor){
            if(error || doctor.length === 0){
                console.log(error);
                req.flash("error", "Doctor not found");
                return res.redirect("/patient");
            }
            console.log(doctor)
            var newAppointment = new Appointment({patient:req.params.id, doctor:doctor._id , date : req.body.time, description : req.body.description})
            newAppointment.save();
            req.flash("success", "Appointment Booked Successfully");
            res.redirect("/patient");
        });
    });
});


//all Appointments
router.get("/", middleware.isLoggedIn, function(req, res){
    Appointment.find({patient:req.params.id}).populate("doctor").exec(function(err, allAppointments){
        if(err){
            console.log(err);
            return res.redirect("/patient");
        }
        res.render("./appointment/view", {appointments:allAppointments});
    });
});


//Update Appointment
router.get("/:app_id/edit", middleware.isLoggedIn, /*checkOwnership*/ function(req,res){
	Appointment.findById(req.params.app_id).populate("doctor").populate("patient").exec(function(err, foundAppointment){
		res.render("./appointment/edit", {patient_id:req.params.id ,appointment:foundAppointment});
	});
});


router.put("/:app_id", middleware.isLoggedIn, /*checkOwnership*/ function(req,res){
    Doctor.findOne({name:req.body.appointment.doctor}, function(err, doctor){
        if(err){
            console.log(err);
            req.flash("error", "Doctor Not Found");
            return res.redirect("/patient")
        }

        var newAppointment = {patient : req.params.id, doctor : doctor._id, date : req.body.appointment.time, description : req.body.appointment.description};
        Appointment.findByIdAndUpdate(req.params.app_id, newAppointment, function(error, updatedAppointment){
            console.log(req.params.app_id, newAppointment);
            if(err){
                console.log(error);
                res.redirect("/patient");
            }
            else{
                console.log(updatedAppointment);
                req.flash("success", "Appointment Updated Successfully !!");
                res.redirect("/patient/"+req.params.id+"/appointment");
            }
        });
    });
});

//Delete Appointment
router.delete("/:app_id",middleware.isLoggedIn,  function(req, res){
    //findByIdAndRemove
    Appointment.findByIdAndRemove(req.params.app_id, function(err){
       if(err){
           res.redirect("/patient/"+ req.params.id );
       } 
       else {
           req.flash("success", "Appointment Deleted !!");
           res.redirect("/patient/" + req.params.id + "/appointment");
       }
    });
});

module.exports = router;