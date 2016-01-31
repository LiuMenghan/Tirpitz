var http = require('http'); 
var engine = require('Tirpitz')({
	tplPath : './tpl',
	buildPath : './build',
});
var Fs = require('fs');
var Path = require('path');

engine.parser.handler = require('./node_modules/Tirpitz/lib/handler/ResponseHandler.js');

var ancestor = module;
var parent = ancestor.parent;
while(parent != undefined && parent != null && parent != ''){
	ancestor = parent;
	parent = ancestor.parent;
}
var rootDir = Path.dirname(ancestor.filename);
var tplBasePath = Path.resolve(rootDir, engine.tplPath);
http.createServer(function (req, res) {
	console.log(req.url)
	var url = req.url.substring(1,req.url.length);
	var tplPath = Path.resolve(rootDir, engine.tplPath, url) + ".tirpitz";
	console.log(tplPath)
	if(Fs.existsSync(tplPath)){
		res.writeHead(200, {});
		engine.render(tplPath, res);
		res.end();
	}else{		
		res.writeHead(404);
		res.end("No Tirpitz template found.");
	}
}).listen(8089);
/*
var app = express(); 
app.get('/*', function(req, res){
	if("favicon.ico" == url){

	}else{
		var tplPath = Path.resolve(rootDir, engine.tplPath, url) + ".tirpitz";
		console.log(tplPath)
		if(Fs.existsSync(tplPath)){
			engine.render(tplPath, res);
			res.send("Hello world!");
			res.end();
		}else{
			res.send("No Tirpitz template found.")
		}
	}
}); 
app.listen('8089');
*/