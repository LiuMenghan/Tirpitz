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
```。

###Initialization 初始化

<table>
  <tr>
    <th>Attribute 属性</th>
    <th>Description</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>tplPath</td>
    <td>The template file folder path</td>
    <td>模板文件存放文件夹路径</td>
  </tr>
  <tr>
    <td>buildPath</td>
    <td>The path of the folder of files which are built by Tirpitz template engine.</td>
    <td>模板引擎生成文件的存放文件夹路径。</td>
  </tr>
  <tr>
  	<td>beforeInterceptorsFileNames</td>
  	<td>The before-interceptor script file path. They will be called in the sequence the same with the sequence in array.</td>
  	<td>before-interceptor脚本文件路径。模板引擎会按照数组顺序依次调用前before-interceptor。</td>
  </tr>
  <tr>
  	<td>afterInterceptorsFileNames</td>
  	<td>The after-interceptor script file path. They will be called in the sequence the same with the sequence in array.</td>
  	<td>afterinterceptor脚本文件路径。模板引擎会按照数组顺序依次调用前after-interceptor。</td>
  </tr>
</table>
## Life-cycle
template files -> before-interceptors -> parser -> after-interceptors -> handlers

### Before-Interceptor 

Before-interceptor will firstly due with the saved text.
