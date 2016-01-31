var engine = require('Tirpitz')({
	tplPath : './tpl',
	buildPath : './build',
});
engine.parser.handler = require('./node_modules/Tirpitz/lib/handler/fileHandler.js');

var Fs = require('fs');
var Path = require('path');

var ancestor = module;
var parent = ancestor.parent;
while(parent != undefined && parent != null && parent != ''){
	ancestor = parent;
	parent = ancestor.parent;
}
var rootDir = Path.dirname(ancestor.filename);

var records = {};
var recordsPath = Path.resolve(rootDir, engine.buildPath, 'build.json');
if(Fs.existsSync(recordsPath)){
	records = JSON.parse(Fs.readFileSync(recordsPath), engine.parser.encoding);
}
//console.log(records);

var tplBasePath = Path.resolve(rootDir, engine.tplPath);
var buildBasePath = Path.resolve(rootDir, engine.buildPath);
if(!Fs.existsSync(buildBasePath)){
	Fs.mkdirSync(buildBasePath)
}
console.log("%s -> %s", tplBasePath, buildBasePath);

var buildList = [];
var files = Fs.readdirSync(tplBasePath);

while(files.length > 0){
	var file = files.pop();
	//console.log(file);
	var pathname = Path.resolve(tplBasePath, file);

	if (Fs.statSync(pathname).isDirectory()){
		
		if(!Fs.existsSync(Path.resolve(buildBasePath, file))){
			Fs.mkdirSync(Path.resolve(buildBasePath, file));
		}
			
		var subFiles = Fs.readdirSync(pathname);
		subFiles.forEach(function(subFile){
			files.push(file + '/' + subFile);
		});
		
	}else{
		var stat = Fs.statSync(pathname);
		var record = records[pathname];
		//Always build
		//if(record == undefined || record.mtime != stat.mtime.getTime()){
			prepareBuild(pathname, stat);
		//}
	}
}

function prepareBuild(pathname, stat){
	stat.mtime = stat.mtime.getTime();
	stat.ctime = stat.ctime.getTime();
	stat.atime = stat.atime.getTime();
	stat.birthtime = stat.birthtime.getTime();
	records[pathname] = stat;
	buildList.push(pathname);	
}

for(var file in records){
	if(!Fs.existsSync(file)){
		var buildPath = getBuildPath(file);
		if(Fs.existsSync(buildPath)){
			Fs.unlinkSync(buildPath);
		}
		records[file] = undefined;
	}
}

buildList.forEach(function(tplPath){
	var buildPath = getBuildPath(tplPath);
	engine.render(tplPath, buildPath);
});

function getBuildPath(tplPath){
	var extname = Path.extname(tplPath);
	return Path.resolve(buildBasePath, tplPath.substring(tplBasePath.length + 1, tplPath.length - extname.length) + ".html");
}
	
var writer = Fs.createWriteStream(recordsPath, {
	flags: 'w',
	defaultEncoding: 'utf8',
	fd: null,
	mode: 0o666
});
var text = JSON.stringify(records, null, '\t');
writer.write(text);
writer.end();



