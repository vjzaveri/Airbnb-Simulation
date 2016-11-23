var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Trip = new Schema({
	trip_id : String,
	property : {
		property_id : String,
		propertyTitle : String,
		description : String,
		propertyPictures : [String],
		qty : Number,
		category : String
	},
	host_id : String,
	user_id : String,
	bill : {
		billing_id: String,
		trip_amount : Number
	},	
	trip_start_date : Date,
	trip_end_date : Date			 
});
module.exports = mongoose.model("Trip",Trip);