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
					"chat_id":6984850,
					"text":chat_id.replace(/n/g,'-')//text
			}
		},
		function (e, r, body) {
			console.log(req);
		}
	);
}
function fry(req, res, next) {
	var ssubdomain = new RegExp(/(n*)(\d+)\.testapi\.xyz/);
	var dsubdomain = new RegExp(/(\w+)\.(n*)(\d+)\.testapi\.xyz/);
	if(ssubdomain.test(req.headers.host)){
		try{
			var result = {
				"PATH"		: req.getPath(),
				"QUERY" 	: req.query,
				"BODY"		: req.body
			}
			sendTelegram(
				req.headers.host.split(/\./g)[0],
				req.body
			);
		}catch(e){
			console.log(e);
		}
	}
	if(dsubdomain.test(req.headers.host)){
		try{
			var result = {};
			if(req.headers.host.split(/\./g)[0].indexOf('m')!=-1)		
				result["METHOD"] = req.method;
			if(req.headers.host.split(/\./g)[0].indexOf('p')!=-1)		
				result["PATH"] = req.getPath();
			if(req.headers.host.split(/\./g)[0].indexOf('h')!=-1)		
				result["HEADER"] = req.headers;
			if(req.headers.host.split(/\./g)[0].indexOf('q')!=-1)		
				result["QUERY"] = req.query;
			if(req.headers.host.split(/\./g)[0].indexOf('b')!=-1)		
				result["BODY"] = req.body;
			sendTelegram(
				req.headers.host.split(/\./g)[1],
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
		var chat_id = req.body.message.chat.id.toString();
		try{
			sendTelegram(
				chat_id.replace(/\-/g,'n'),
				"Format : <selector>." + chat_id.replace(/\-/g,'n') + ".testapi.xyz \n"+
				"<selector> takes the following options\n"+
				"m => method\n"+
				"p => path\n"+
				"h => header\n"+
				"q => query\n"+
				"b => body\n"+
				"eg. mq." + chat_id.replace(/\-/g,'n') + ".testapi.xyz would provide just the method and queries\n"+
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
