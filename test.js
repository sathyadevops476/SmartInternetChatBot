var builder = require('botbuilder');
var restify = require('restify');
var request = require('request');
//var connector = new builder.ConsoleConnector().listen();

var connector = new builder.ChatConnector({
	appId: 'd514aa3c-29c9-4efd-955a-e915d77b4699',
	appPassword: 'Ln2VG6As7OXi9m5qn9KoLSK'
});

var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();

//set up restify server
var server = restify.createServer();
server.listen(3309, function(){
	console.log('%s listening to %s', server.name,server.url);
});
var sessionUsername='';

server.post('/api/messages', connector.listen());


bot.dialog('/', intents);

intents.matches(/^change name/i, [

	function(session){
		session.beginDialog('/namechange');
	},

	function(session, results){
		session.send('Ok! Your name is changed to %s.', session.userData.name);
	}

]);

intents.onDefault([

	function(session, args, next){
		if(!session.userData.name){
			session.beginDialog('/profile');
		}
		else
		{
			next();
		}
	},

	function(session,results){
		console.log("Session data intents: " +session.userData.name);
		session.send('Hello %s!!! Iam SmartInternet bot messenger!!', session.userData.name);
		session.beginDialog('/rootMenu');
	}

]);

bot.dialog('/rootMenu', [

	function(session){
		builder.Prompts.choice(session, "Please let me know how can i help you.. What would you like to do?? Select an option buddy!!",
			'Know about your Wi-Fi device|Wi-Fi Device health check|Know about your data usage|WiFi Settings configuration|Restart your Wifi device|Quit');
	},

	function(session, results){
		switch(results.response.index){
			case 0:
				session.beginDialog('/devicedetails');
				break;
			case 1:
				session.beginDialog('/healthcheck');
				break;
			case 2:
				session.beginDialog('/datausage');
				break;
			case 3:
				session.beginDialog('/settings');
				break;
			case 4:
				session.beginDialog('/devicerestart');
				break;
			case 5:
				session.beginDialog('/quit');
				break;
			default:			    
				session.endDialog();
				break;

		}

	},
	function(session){
		session.replaceDialog('/rootMenu');
	}

	]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });



bot.dialog('/devicedetails', [
	function(session, results){
		request('http://localhost:3000/api/deviceprofiles/'+session.userData.name, function(error, response, body){
				if(error){
					console.log(error);
				}
				
				var parsed = JSON.parse(body);							
				session.send('Your Device Details::: Device: %s'+" "+'MacAddress::: %s'+"  "+'ConnectionType: %s'+" "+'IPAddress: %s',parsed[0].devicename,parsed[0].macaddress,parsed[0].connectiontype,parsed[0].ipaddress);

				/*session.send('Device: %s', parsed[0].devicename);
				session.send('MacAddress: %s', parsed[0].macaddress);
				session.send('ConnectionType: %s', parsed[0].connectiontype);
				session.send('IPAddress: %s', parsed[0].ipaddress);	*/
				console.log(parsed);
				session.endDialog();
				
			});

	}


	]);

bot.dialog('/healthcheck', [
	function(session){	
	session.send('Your device is very healthy now. Dont worry!!');
	session.replaceDialog('/rootMenu');	
	}]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

bot.dialog('/quit', [
		function(session){	
		//session.send('Bye buddy!! Have a great day!!');	
		builder.Prompts.confirm(session, "Are you sure you want to quit the messenger??");		
		},
		function(session,results){
				var input = results.response;
				console.log("User input for confirmation:: " +input);
				//session.send("You chose '%s'", results.response ? 'yes' : 'no')
				if(input)
				{
					session.send("Bye Buddy!! Have a great day!!");
					
				}
				else
				{					
					session.endDialog();
				}
		}

	]);



bot.dialog('/profile', [

		function(session){
			builder.Prompts.text(session, 'Hey! Greetings!! Please key your xfinity username..');
		},

		function(session,results){
			
			var username = results.response;			
			request('http://localhost:3000/api/userprofiles/'+username, function(error, response, body){
				if(error){
					console.log(error);
				}
				
				var parsed = JSON.parse(body);				
				console.log("parsed:::" +parsed[0].name);
				session.userData.name = parsed[0].name;
				console.log("Session data:" +session.userData.name);
			});
			
			session.userData.name = sessionUsername;
			sessiond = sessionUsername;
			console.log("Session data outside func:" +session.userData.name);
			session.endDialog();
		}
]);

bot.dialog('/namechange', [

		function(session){
			builder.Prompts.text(session, 'Please re-enter your name..');
		},

		function(session,results){
			session.userData.name = results.response;
			session.endDialog();
		}
]);

bot.dialog('/datausage', [	
	function(session){
	var max = 100;
	var min = 5;	
	var datausage = Math.floor(Math.random()*(max-min+1)+min);
	session.send('Your data is usage is %s GB', datausage);
	session.replaceDialog('/rootMenu');	
	}]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });
