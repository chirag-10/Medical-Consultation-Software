var mongoose 				= require("mongoose"),
	passportLocalMongoose	= require("passport-local-mongoose")
	
mongoose.connect("mongodb://localhost/SHCS");

var UserSchema = new mongoose.Schema({
	username : 'String',
	role	 : 'Number',
	password : 'String',

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);