# NamineJS
OpenCart modification parser.
I made it to parse modifications from dev files. 
So for the start you need two versions of your project: dev and work.

In dev you are writing your modifications with certain commentaries.

## Quick start

```
npm install namine

```

Write in your dev code your modifications

Modification for .php files:
```
...
//-nmn MODIFICATION_NAME pos:"POSITION" line:"LINE"
MODIFICATION_TEXT
//-nmn
...
```

Modification for .tpl and .twig files
```
...
<!--//-nmn MODIFICATION_NAME pos:"POSITION" line:"LINE"-->
MODIFICATION_TEXT
<!--//-nmn-->
...
```
* MODIFICATION_NAME - name of your modification without spaces
* POSITION - position of modification (after, before, replace)
* LINE - line after, before or replaced of your modification
* MODIFICATION_TEXT - just your modification


##Examples:

test.js

```
var namine = require('namine');

namine.makeModification({modification_name:'privet'});
```

catalog/controller/product/product.php
```
...
//-nmn test_name pos:"before" line:"if ($product_info) {"
$data['hello'] = 'Hello';
$data['hello2'] = 'World!';
//-nmn
if ($product_info) {
...
```

catalog/view/theme/default/template/product/product.tpl
```
...
<?php if ($review_status) { ?>
<!--//-nmn privet pos:"after" line:"<?php if ($review_status) { ?>"-->
<?php echo $hello . ' ' . $hello2;?>
<!--//-nmn-->
...
```

output privet.ocmod.xml
```
<?xml version="1.0" ?>
<!DOCTYPE modification []>
<modification>
	<name>privet</name>
	<version>0.1</version>
	<author>Author</author>
	<link></link>
	<code>privet</code>	
	<file path="catalog/view/theme/*/template/product/product.tpl">
		<operation>
			<search><![CDATA[<?php if ($review_status) { ?>]]></search>
			<add position="before"><![CDATA[
	          ПРИВЕТ
	          ]]></add>
		</operation>
	</file>

</modification>
```