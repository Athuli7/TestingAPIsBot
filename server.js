var restify = require('restify');
var plugins = require('restify-plugins');
var request = require('request');
var fs = require('fs');

var settings = require('./settings.json');

const server = restify.createServer({
	name: 'TestingAPIsBot',
	version: '0.1.1'
});
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());

server.get('.*',fry);
server.post('.*',fry);
function sendTelegram(chat_id, text){
	request.post(
		{
			url : 'https://api.telegram.org/bot'+settings.tBotToken+'/sendMessage',
			formData : {
					"chat_id":chat_id,
					"text":text
			}
		},
		function (e, r, body) {
			//console.log(req);
		}
	);
}
function fry(req, res, next) {
	if(req.headers.host.includes(/(\d+)\.testapi\.xyz/)){
		try{
			var result = {
				"METHOD"	: req.method,
				"PATH"		: req.getPath(),
				"HEADER"	: req.headers,
				"GET_VARS" 	: req.query,
				"POST_VARS"	: req.body
			}
			sendTelegram(
				req.headers.host.split('.')[0],
				JSON.stringify(
					result,
					null,
					7
				)
			);
		}catch(e){
			console.log(e);
		}
	}
	if(req.headers.host == "testapi.xyz"){
		try{
			sendTelegram(
				req.body.message.from.id,
				"Use "+req.body.message.from.id+".testapi.xyz for all requests."
			);
		}catch(e){
			console.log(e);
		}
	}
	res.send(result);
	return next();
}

server.listen((process.env.PORT || 8080), function () {
	console.log('%s listening at %s', server.name, server.url);
});
