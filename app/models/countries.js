var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// user schema 
var CountrySchema   = new Schema({
	name: String,
	code: String
});

module.exports = mongoose.model('Country', UserSchema);