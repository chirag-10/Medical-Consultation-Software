var mongoose = require("mongoose");

var patientSchema = new mongoose.Schema({
	name : {
		type:String
	},
	age : String,
	gender : String,
	email : String,

});



module.exports = mongoose.model("Patient", patientSchema);
