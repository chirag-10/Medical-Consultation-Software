var mongoose = require("mongoose");

var patientSchema = new mongoose.Schema({
	name : String,
	age : String,
	Gender : String,
	user : {
		id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      }
	}
	

});



module.exports = mongoose.model("Patient", patientSchema);
