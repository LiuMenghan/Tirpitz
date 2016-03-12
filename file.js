var engine = require('Tirpitz')({
	tplPath : './tpl',
	buildPath : './build',
});

//使用文件输出
engine.parser.handler = require('./node_modules/Tirpitz/lib/handler/fileHandler.js');

var Fs = require('fs');
var Path = require('path');

//获取项目根目录
var ancestor = module;
var parent = ancestor.parent;
while(parent != undefined && parent != null && parent != ''){
	ancestor = parent;
	parent = ancestor.parent;
}
var rootDir = Path.dirname(ancestor.filename);

//获取之前的生成记录
var records = {};
var recordsPath = Path.resolve(rootDir, engine.buildPath, 'build.json');
if(Fs.existsSync(recordsPath)){
	records = JSON.parse(Fs.readFileSync(recordsPath), engine.parser.encoding);
}
//console.log(records);

//获取模版目录和生成目录
var tplBasePath = Path.resolve(rootDir, engine.tplPath);
var buildBasePath = Path.resolve(rootDir, engine.buildPath);
if(!Fs.existsSync(buildBasePath)){
	Fs.mkdirSync(buildBasePath)
}
console.log("%s -> %s", tplBasePath, buildBasePath);

//获取待生成模版文件
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
		//目前全部重新生成，因为暂时没有解决生成时模版依赖的问题
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

//待渲染变量
var variables = {
	"date" : new Date().toLocaleDateString()
}

//渲染并生成页面
buildList.forEach(function(tplPath){
	var buildPath = getBuildPath(tplPath);
	engine.render(tplPath, buildPath, variables);
});

function getBuildPath(tplPath){
	var extname = Path.extname(tplPath);
	return Path.resolve(buildBasePath, tplPath.substring(tplBasePath.length + 1, tplPath.length - extname.length) + ".html");
}
	
//输出生成记录
var writer = Fs.createWriteStream(recordsPath, {
	flags: 'w',
	defaultEncoding: 'utf8',
	fd: null,
	mode: 0o666
});
var text = JSON.stringify(records, null, '\t');
writer.write(text);
writer.end();



