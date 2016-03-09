# Tirpitz
Static template engine based on NodeJS.

## Example
```
var engine = require('Tirpitz')({
	tplPath : './tpl',
	buildPath : './target',
	//beforeInterceptorsFileNames : ['./interceptor/demoInterceptor.js'],
	afterInterceptorsFileNames : ['./interceptor/demoInterceptor.js']
});

//engine.parser.handler = require('./node_modules/Tirpitz/lib/handler/ConsoleHandler.js');

var d = new Date();

var variables = {
	date : d.toLocaleDateString()
};
engine.render('example.tirpitz', console, variables);
```

Template files are read by template engine as plain text and save in memory, which makes it having performance problem in product environment if it is used by compiling real-time.

模板引擎会读取模板文件并以文本的形式存储在内存中，因而并不适合在生产环境中实时编译使用。

###Initialization 初始化

<table>
  <th>
    <td>Attribute 属性</td>
    <td>Description</td>
    <td>说明</td>
  <th>
  <tr>
    <td>tplPath</td>
    <td>The template file  pa
    
  </tr>
</table>
tplPath : 
## Life-cycle
template files -> before-interceptors -> parser -> after-interceptors -> handlers

### Before-Interceptor 

Before-interceptor will firstly due with the saved text.
