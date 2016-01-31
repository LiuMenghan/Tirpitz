var engine = require('Tirpitz')({
	tplPath : './tpl',
	buildPath : './target',
	//beforeInterceptorsFileNames : ['./interceptor/demoInterceptor.js'],
	afterInterceptorsFileNames : ['./interceptor/demoInterceptor.js']
});


//engine.render('example.tirpitz', console);
engine.render('inheritance/child.tirpitz', console);



