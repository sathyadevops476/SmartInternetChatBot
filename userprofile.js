var mongoose = require('mongoose');

var userProfileSchema = mongoose.Schema({

	name: String,
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	location: String,
	createdAt: {
		type: Date,
		default: Date.now
	}

});

var userProfile = module.exports = mongoose.model('userprofile',userProfileSchema);

module.exports.getUserProfiles = function(callback,limit){
	userProfile.find(callback).limit(limit);
}

module.exports.getUserProfileByUserName = function(username, callback){
	userProfile.find({'username': username}, callback);
}

module.exports.addUserProfile = function(userprofile, callback){
	userProfile.create(userprofile, callback);
}