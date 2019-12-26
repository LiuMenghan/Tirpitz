# Tirpitz
A light extensiable static template engine based on NodeJS.

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
  <tr>
  	<td>extendProcessorsDir </td>
  	<td>The dir path of custom processors.</td>
  	<td>自定义processor路径。</td>
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


## Parser Extension point

### beforeInterceptors

前置拦截器数组，通常由自动解析beforeInterceptorsFileNames生成。每个前置拦截器需要实现before(context : String)方法，在解析模版前对文件文本进行处理。

### afterInterceptors 

后置拦截器数组，通常由自动解析afterInterceptorsFileNames生成。每个后置拦截器需要实现after(rootNode : TemplateNode)方法，在解析模板后对模版树进行处理。

### elementProcessors

节点处理器。Parser解析模版时会根据节点名称调用对应的节点处理器。默认会加载processor下variables.js和super.js两个节点处理器。

每个节点处理器必须具有属性processerName（节点名称）和process（节点处理方法）。

process方法参数列表

<table>
	<th>
	<td>参数名称</td><td>参数类型</td><td>说明</td>
	</th>
	<tr>
	<td>node</td><td>TemplateNode</td><td>当前模版节点</td>
	</tr>
	<tr>
	<td>tplPath</td><td>String</td><td>模版路径</td>
	</tr>
	<tr>
	<td>parser</td><td>Parser</td><td>解析器</td>
	</tr>
	<tr>
	<td>variables</td><td>Object</td><td>外部传入变量</td>
	</tr>
</table>

procesoor处理结束后需要设置node.processorName = ""，标记processor处理结束。

### variable processor

变量替换processor。
```
{%variable={"key":"date"} /%}
```
生成模版时，`date`会被替换为variables中key=`date`的value。

### super processor

继承procesor。一个模板文件可以继承自另一个模版文件。

```
Super head
{%replacable={"id":"replacer0"} /%}
Super body
{%replacable={"id":"replacer1"} /%}
Super bottom
```

父模版中可以定义`replacable`代码标签，定义需要被子模板覆盖的位置。

```
Child text before super.
{%super={"parent":"./super.tirpitz"}%}
	{%override={"id":"replacer0"}%}Text in child replacer0.{%/override%}
	{%override={"id":"replacer1"}%}Text in child replacer1.{%/override%}
{%/super%}
Child text after super.
```
子模板中定义`super`标签，指定父模版路径。`overide`标签指定要覆盖的内容。

上面两个模版生成内容如下：
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

开始标签，必须成对出现，默认值为` ["{%", "%}"]`。

### endTag

结束标签，必须成对出现，默认值为`["{%/", "%}"]`。

### signleTag

独立标签，数组第一项必须与开始标签的第一项相同，默认值为`["{%", "/%}"]`。

### assignSymbol

赋值符号，默认值为`=`。

### escapeCharacter

转译符号，默认值为`\`。

### encoding

编码格式，默认为utf-8。

### checkTags

标签合法性检查，默认开启。

### checkSymbol

赋值符号、转义符号检查，默认开启。

## Demo
### console.js
输出到控制台。适合用来调试processor/before-interceptor/after-interceptor。

### file.js
输出到文件，适合将生成的文件使用在生产环境。

### server.js
输出到http response，适合在开发环境调试模板文件。

