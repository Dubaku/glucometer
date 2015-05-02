var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema 
var MeasureSchema   = new Schema({
	user_id: { type: String, required: true },
	value: { type: Number, required: true },
	datetime: { type: Date, default: Date.now },
	meal: String,
	note: String
});

module.exports = mongoose.model('Measure', MeasureSchema);