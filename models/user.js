var mongoose 				= require("mongoose"),
	passportLocalMongoose	= require("passport-local-mongoose")
	
mongoose.connect("mongodb://localhost/SHCS");

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	  },
	username: {
		type: String,
		required: true,
		unique: true
	  },
	password: {
		type: String
	  },
	role	 : 'Number',

});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);