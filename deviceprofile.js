var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({
		username: {
			type: String,
			required: true,
			unique: true
		},
		devicename: {
			type: String,
			required: true
		},
		hostname: {
			type: String,
			required: true
		},
		macaddress: {
			type: String,
			required: true
		},
		connectiontype: {
			type: String,
			required: true
		},
		accesspoint: {
			type: String,
			required: true
		},
		ipaddress: {
			type: String,
			required: true
		}
});

var devices = module.exports = mongoose.model('deviceprofile', deviceSchema);

module.exports.getDeviceDetails = function(callback,limit){
	devices.find(callback).limit(limit);
}

module.exports.getDeviceDetailsByUsername = function(username,callback){
	devices.find({'username':username}, callback);
}

module.exports.addDeviceProfile = function(deviceprofile, callback){
	devices.create(deviceprofile, callback);
}