const express    = require('express');
const router     = express.Router();
const Doctor     = require('../models/doctor');
const User       = require('../models/user.js');
const mongoose   = require('mongoose');
const nodemailer = require('nodemailer');
var   generator  = require('generate-password');
var   middleware = require("../middleware");

router.get('/addDoc',  middleware.isAdmin ,(req, res) => res.render("addDoctor"));

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
              const newUser = new User({
                name,
                email,
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

function sendMail(sub, msg, tomail){
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "smarthealthconsulting24.7@gmail.com",
      pass: "teproject123"  
    }
  });
  
  var mailOptions = {
    from: '"Smart Health Consulting Project" <motu8034@gmail.com>',
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
