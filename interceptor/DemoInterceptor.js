exports=module.exports=function(){
	return exports;
}

exports.interceptorName="demo"

exports.before = function(context){
	console.log(context);
	return context;
}

exports.after = function(rootNode){
	console.log(rootNode);
}