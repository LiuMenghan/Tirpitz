# Tirpitz

基于node.js的轻量级易扩展静态模版引擎。

A light extensible static template engine based on node.js.

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
    <th>属性 Attribute</th>
    <th>说明</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>`tplPath`</td>
    <td>模板文件存放文件夹路径</td>
    <td>The template file folder path</td>
  </tr>
  <tr>
    <td>`buildPath`</td>
    <td>模板引擎生成文件的存放文件夹路径。</td>
    <td>The path of the folder of files which are built by Tirpitz template engine.</td>
  </tr>
  <tr>
  	<td>`beforeInterceptorsFileNames`</td>
  	<td>before-interceptor脚本文件路径。模板引擎会按照数组顺序依次调用前before-interceptor。</td>
  	<td>The before-interceptor script file path. They will be called in the sequence the same with the sequence in array.</td>
  </tr>
  <tr>
  	<td>`afterInterceptorsFileNames`</td>
  	<td>afterinterceptor脚本文件路径。模板引擎会按照数组顺序依次调用前after-interceptor。</td>
  	<td>The after-interceptor script file path. They will be called in the sequence the same with the sequence in array.</td>
  </tr>
  <tr>
  	<td>`extendProcessorsDir`</td>
  	<td>自定义processor路径。</td>
  	<td>The dir path of custom processors.</td>
  </tr>
</table>

## Life-cycle
template files -> before-interceptors -> parser -> processor -> after-interceptors -> handlers 

1. 模板文件会首先被作为文本读取到内存中
2. before-interceptor会对文本进行前置处理
3. parser会将文本解析成模板树
4. 遍历模板树，如果发现模板节点可以用processor处理的话就用processor处理
5. 交由after-interceptor对模板树进行后置处理
6. 交由handler输出到控制台/文件/http response

1. Template files are firstly read as text into memory
2. Do with before-interceptors before parsing
3. Parser parse the text processed by before-interceptors and convert it into template node tree
4. Use processor to process template node if any node is found be able to be processed by the processor when traversing the node tree
5. Do with after-interceptors
6. Use a handler to output the result to console/file/http response.


## 解析器扩展点Parser Extension point

### `beforeInterceptors`

前置拦截器数组，每个拦截器会按照数组顺序依次处理文本。

Array of before-interceptors. Each interceptor will process the text in the template file according to the sequence in array.

### `afterInterceptors` 

后置拦截器数组，每个拦截器会按照数组顺序依次处理模版节点树。

Array of after-interceptors. Each interceptor will process the template node tree according to the sequence in array.

### `elementProcessors`

节点处理器。Parser解析模版时会根据节点名称调用对应的节点处理器。默认会加载processor下variables.js和super.js两个节点处理器。

每个节点处理器必须具有属性`processerName`（节点名称）和方法`process`（节点处理方法）。

The processors for nodes. The parser will call a certain processor if the name of the node matches the processor's name. The two processors, variables.js and super.js, will be loaded by default.

Each processor must have the attribute processorName(the name of the processor) and the method process(for processing node).

Parameters of the `process` method:

<table>
	<tr>
	<th>参数名称 Parameter Name</th><th>参数类型 Parameter Type</th><th>说明</th><th>Description</th>
	</tr>	
	<tr>
	<td>`node`</td><td>TemplateNode</td><td>当前模版节点</td><td>Current node</td>
	</tr>
	<tr>
	<td>`tplPath`</td><td>String</td><td>模版路径</td><td>Path of template file</td>
	</tr>
	<tr>
	<td>`parser`</td><td>Parser</td><td>解析器</td><td>Parser</td>
	</tr>
	<tr>
	<td>`variables`</td><td>Object</td><td>外部传入变量</td><td>Variables passed from the outside</td>
	</tr>
</table>

如果想避免processor重复处理，在processor处理结束后将`node.processorName`赋值为""。

Set node.processor to blank after processing if wishing to avoid processing duplicated.

#### variable processor

Example:

```
{%variable={"key":"date"} /%}
```

生成时，标签会被替换为variables中key=`date`的value。

The tag will be replaced by the value whose key is `date` in 标签会被替换为variables中key.

#### super processor

Example:

super.js:

```
Super head
{%replacable={"id":"replacer0"} /%}
Super body
{%replacable={"id":"replacer1"} /%}
Super bottom
```

child.js:

```
Child text before super.
{%super={"parent":"./super.tirpitz"}%}
	{%override={"id":"replacer0"}%}Text in child replacer0.{%/override%}
	{%override={"id":"replacer1"}%}Text in child replacer1.{%/override%}
{%/super%}
Child text after super.
```

child.js的super标签会被替换为super.js中的内容；super.js中的replacable标签会被替换为child.js中id相同的override标签。渲染child.js结果如下：

The super tag in child.js will be replaced by super.js while the replaceable tag in super.js will be replaced by the override tag with the same id in child.js. The result of rendering child.js：

```
Child text before super.
Super head
Text in child replacer0
Super body
Text in child replacer1.
Super bottom
Child text after super.
```
### starterTag

开始标签，必须成对出现，默认值为`["{%", "%}"]`。

Starter tags must appear as tuple. The default value is `["{%", "%}"]`.

### endTag

结束标签，必须成对出现，默认值为`["{%/", "%}"]`。

End tags must appear as tuple. The default value is `["{%/", "%}"]`.

### signleTag

独立标签，第一项必须与开始标签的第一项相同，默认值为`["{%", "/%}"]`。

The first tag of single tags must be the same with the first tag of starter tags. The default value is `["{%", "/%}"]`.

### assignSymbol

赋值符号，默认值为`=`。

The default value of the assign symbol is `=`.

### escapeCharacter

转译符号，默认值为`\`。

The default value of the escape character is `\`.

### encoding

编码格式，默认为utf-8。

Default encoding is utf-8.

### checkTags

标签合法性检查，默认开启。

Enable checking tags by default. 

### checkSymbol

赋值符号、转义符号检查，默认开启。

Enable checking the assign symbol and the escape character by default.

## Demo

### console.js

输出到控制台。适合用来调试processor/before-interceptor/after-interceptor。

Output to console. Generally use for debugging processors/before-interceptors/after-interceptors.

### file.js

输出到文件。

Output to file.

### server.js

输出到http response，适合在开发环境调试模板文件。

Output to http response. Generally use for debugging template file in development enviroment.

