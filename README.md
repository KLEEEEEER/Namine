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


## Examples:

### test.js

```
var namine = require('namine');

namine.makeModification({
	modification_name:'hello',
	author:'test_author',
	link:'test.com',
	version:'0.1',
});
```

### catalog/controller/product/product.php
```
...
//-nmn hello pos:"before" line: $product_info = $this->model_catalog_product->getProduct($product_id);
		$data['hello1'] = 'hello';

		$data['hello2'] = '???';
		//-nmn
		$product_info = $this->model_catalog_product->getProduct($product_id);
...
```

### catalog/view/theme/default/template/product/product.tpl
```
...
<?php if ($review_status) { ?>
<!--//-nmn hello pos:"after" line: <?php if ($review_status) { ?>-->
<?php echo $hello . ' ' . $hello2;?>
<!--//-nmn-->
...
```

### output hello.ocmod.xml
```
<?xml version="1.0" ?>
<!DOCTYPE modification []>
<modification>
	<name>hello</name>
	<version>0.1</version>
	<author>test_author</author>
	<link>test.com</link>
	<code>hello</code>	
	<file path="catalog/controller/product/product.php">
		<operation>
			<search><![CDATA[$product_info = $this->model_catalog_product->getProduct($product_id);]]></search>
			<add position="before"><![CDATA[
		$data['hello1'] = 'hello';

		$data['hello2'] = '???';
		]]></add>
		</operation>
	</file>
	
	<file path="catalog/view/theme/*/template/product/product.tpl">
		<operation>
			<search><![CDATA[<?php echo $column_left; ?>]]></search>
			<add position="before"><![CDATA[
	<?php echo $hello1 . $hello2;?>
	]]></add>
		</operation>
	</file>

</modification>
```