var express 		  = require("express"),
	  router			  = express.Router(),
	  User			    = require("../models/user"),
	  middleware		= require("../middleware"),
	  passport		  = require("passport"),
    Patient			  = require("../models/patient"),
    Doctor        = require("../models/doctor"),
    nodemailer    = require('nodemailer'),
    generator     = require('generate-password'),
    Appointment   = require("../models/appointment")


router.get("/new", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
    res.render("./doctor/new");
});

router.get("/", middleware.isLoggedIn, function(req,res){
  res.render('./doctor/index');
});



router.get("/:id",middleware.isLoggedIn , function(req, res){
    Doctor.findById(req.params.id, function(err, doctor){
        if(err){
            console.log(err);
            return res.redirect("/patient");
        }
        res.render("./doctor/show", {doctor : doctor});
    });
});

router.post('/', middleware.isLoggedIn, middleware.isAdmin, (req,res,next)=>{
    const { name, email, address, phone, degree, remark } = req.body;
    Doctor.find({ email: req.body.email })
    .exec()
    .then(doctors => {
      if (doctors.length >= 1) {
        req.flash("error", "Doctor with same email Id already registered")
        res.redirect('/admin')
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
              const newUser = new User({
                name:name,
                username:email,
                role:2,
          });
          User.register(newUser, pass)
                .then(result => {
                  console.log("New User has been registered")
                })
          res.redirect('/admin')
        }
    });
});

router.get("/:id/appointment", function(req,res){
  User.findById(req.params.id, function(error, user ){
    if(error){
      console.log(err);
      return res.redirect("/doctor");
    }
    Doctor.findOne({email: user.username}, function(error1, doctor){
        if(error){
          console.log(error1);
          return res.redirect("/doctor");
        }
        Appointment.find({doctor:doctor._id}).populate("patient").exec(function(err, allAppointments){
          if(err){
            req.flash("error", err.message);
            return res.redirect("/doctor");
          }
          res.render("./doctor/appointments",{appointments : allAppointments});
        });
      });
  });
});



function sendMail(sub, msg, tomail){
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "smarthealthconsulting24.7@gmail.com",
      pass: "teproject123"  
    }
  });
  
  var mailOptions = {
    from: '"Smart Health Consulting Project" <smarthealthconsulting24.7@gmail.com>',
    to: tomail,
    subject: sub,
    html: msg
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function initialPassword(){
  var password = generator.generate({
    length: 10,
    numbers: true
});
  return password;
}

module.exports=router;

