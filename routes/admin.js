const express    = require('express');
const router     = express.Router();
const Doctor     = require('../models/doctor');
const User       = require('../models/user.js');
const mongoose   = require('mongoose');
const nodemailer = require('nodemailer');
var   generator  = require('generate-password');
var   middleware = require("../middleware");
const Admin      = require("../models/admin");
const Patient	 = require("../models/patient");
const Appointment = require('../models/appointment');


router.post('/addDoc', middleware.isAdmin, (req,res,next)=>{
    const { name, email, address, phone, degree, remark } = req.body;
    Doctor.find({ email: req.body.email })
    .exec()
    .then(doctors => {
      if (doctors.length >= 1) {
        res.render('addDoctor')
      } else {
            const doc = new Doctor({
              name,
              email,
              address,
              phone,
              degree,
              remark,
            });
            var pass = initialPassword()
            console.log(doc);
            doc
              .save()
              .then(result => {
                sendMail( 'Login credentials for Smart Health Project account.',
                          "Email Id:" + req.body.email + "\n" + "Password:" + pass + "\n You can reset your password on our website.",
                          email
                        )
              })
              .catch(err => {
                res.send(err)
              });
              const username = email;
              const newUser = new User({
                name,
                username,
                pass,
                role:2,
          });
          newUser
                .save()
                .then(result => {
                  console.log("New User has been registered")
                })
          res.redirect('/')
        }
    });
});

router.get("/new", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  res.render("./admin/new");
});

router.post("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
	var newAdmin = new Admin({name:req.body.name, email:req.body.email}) ;
	newAdmin.save();
	var newUser = new User({name : req.body.name, username : req.body.email, role:0});
	
	
	User.register(newUser,  req.body.password, function(err, user){
		if(err){
			console.log(err.message);
			req.flash('error', err.message);
			return res.redirect("/admin/new");
    }
    req.flash("success", "New Admin Registered Successfully ! !");
		res.redirect("/admin");
	});
});

router.get('/admin', middleware.isLoggedIn, middleware.isAdmin, function(req, res){
	Admin.find({}, function(err, allAdmin){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect('/admin');
		}
		res.render('./admin/view', {users:allAdmin, heading:"View All Admins"});
	});
});

router.get('/patient', middleware.isLoggedIn, middleware.isAdmin, function(req, res){
	Patient.find({}, function(err, allPatient){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect('/admin');
		}
		res.render('./admin/view', {users:allPatient, heading:"View All Patients"});
	});
});

router.get('/doctor', middleware.isLoggedIn, middleware.isAdmin, function(req, res){
	Doctor.find({}, function(err, allDoctor){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect('/admin');
		}
		res.render('./admin/view', {users:allDoctor, heading:"View All Doctors"});
	});
});

router.get('/appointment', middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	Appointment.find({}).populate("doctor").populate("patient").exec(function(err, allAppointments){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/admin");
		}
		res.render("./admin/appointments", {appointments : allAppointments});
	});
});
	
module.exports = router;

