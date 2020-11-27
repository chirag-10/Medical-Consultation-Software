var mongoose = require("mongoose");

var patientSchema = new mongoose.Schema({
	name : {
		type:String
	},
	email : String,
	medical_record : 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Medical_Records"
		 } 

});



module.exports = mongoose.model("Patient", patientSchema);
