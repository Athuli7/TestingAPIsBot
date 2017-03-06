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
			console.log(req);
		}
	);
}
function fry(req, res, next) {
	var subdomain = new RegExp(/(\w*)(\d+)\.testapi\.xyz/);
	if(subdomain.test(req.headers.host)){
		try{
			var result = {
				"METHOD"	: req.method,
				"PATH"		: req.getPath(),
				"HEADER"	: req.headers,
				"QUERY" 	: req.query,
				"BODY"		: req.body
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
				"Format : <selector>."+req.body.message.from.id+".testapi.xyz \n"+
				"<selector> takes the following options\n"+
				"m => method\n"+
				"p => path\n"+
				"h => header\n"+
				"q => query\n"+
				"b => body\n"+
				"eg. mq.5834785.testapi.xyz would provide just the method and queries\n"+
				"defaults to \'pqb\'\n"+
				"We\'ll have HTTPS soon"
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
