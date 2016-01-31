var http = require('http'); 
var engine = require('Tirpitz')({
	tplPath : './tpl',
	buildPath : './build',
});
var Fs = require('fs');
var Path = require('path');
var Url = require('url');

engine.parser.handler = require('./node_modules/Tirpitz/lib/handler/ResponseHandler.js');

var ancestor = module;
var parent = ancestor.parent;
while(parent != undefined && parent != null && parent != ''){
	ancestor = parent;
	parent = ancestor.parent;
}
var rootDir = Path.dirname(ancestor.filename);
var tplBasePath = Path.resolve(rootDir, engine.tplPath);


var variables = {
	"basePath" : "http://localhost:8088",
	"year" : new Date().getFullYear(),
	"date" : new Date().toLocaleDateString()
}

http.createServer(function (req, res) {
	var pathname = Url.parse(variables.basePath + req.url).pathname;
	var extname = Path.extname(pathname);
	var url = pathname.substring(1,pathname.length - extname.length);
	console.log(new Date().toLocaleDateString + ":" + url)
	url = "" == url ? "index" : url;
	var tplPath = Path.resolve(rootDir, engine.tplPath, url) + ".tirpitz";
	console.log(tplPath)
	if(Fs.existsSync(tplPath)){
		res.writeHead(200, {});
		engine.render(tplPath, res, variables);
		res.end();
	}else{		
		res.writeHead(404);
		res.end("No Tirpitz template found.");
	}
}).listen(8089);