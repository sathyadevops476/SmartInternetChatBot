var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var userProfile = require('./model/userprofile');
var deviceProfile = require('./model/deviceprofile');

mongoose.connect('mongodb://localhost/smartinternet');

var db = mongoose.connection;

app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send('Please access /api/userprofiles or /api/deviceprofiles...');
});

app.get('/api/userprofiles', function(req,res){

	userProfile.getUserProfiles(function(err,userprofiles){
		if(err){
			throw err;
		}
		res.json(userprofiles);
	});

});

app.get('/api/deviceprofiles', function(req, res){

	deviceProfile.getDeviceDetails(function(err,deviceprofiles){
		if(err){
			throw err;
		}
		res.json(deviceprofiles);
	});

});

app.get('/api/userprofiles/:username', function(req,res){

		userProfile.getUserProfileByUserName(req.params.username,function(err,userprofile){
			if(err){
				throw err;
			}
			res.json(userprofile);

		});
});

app.get('/api/deviceprofiles/:username', function(req,res){
	deviceProfile.getDeviceDetailsByUsername(req.params.username, function(err,deviceprofile){
		if(err){
			throw err;
		}
		res.json(deviceprofile);
	});

});


app.post('/api/userprofiles', function(req, res){

	var uProfile = req.body;
	console.log(uProfile);
	userProfile.addUserProfile(uProfile, function(err, uProfile){
		if (err) {
    		console.log('Error inserting user profile to db');
			    if (err.name == 'ValidationError') {
			        for (field in err.errors) {
			            console.log(err.errors[field].message); 
			        }
			    }
			}
		res.json(uProfile);
	});
});

app.post('/api/deviceprofiles', function(req, res){

		var dProfile = req.body;
		deviceProfile.addDeviceProfile(dProfile, function(err, dProfile){
			if(err){
				if(err.name == 'ValidationError'){
					for(field in err.errors){
						console.log(err.errors[field].message);
					}
				}

			}
			res.json(dProfile);
		});
});

app.listen(3000, function(){
	console.log('Running on port 3000');
});