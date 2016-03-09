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
template files -> before-interceptors -> parser -> processor -> after-interceptors -> handlers 

1.模板文件会首先被作为文本读取到内存中
2.before-interceptor会对文本进行前置处理
3.parser会将文本解析成模板数
4.遍历模板树，如果发现模板节点可以用processor处理的话就用processor处理
5.交由after-interceptor对模板数进行后置处理
6.交由handler输出到控制台/文件/http response

## Demo
### console.js
输出到控制台。适合用来调试processor/before-interceptor/after-interceptor。

### file.js
输出到文件，适合将生成的文件使用在生产环境。

### server.js
输出到http response，适合在开发环境调试模板文件。

