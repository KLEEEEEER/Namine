# Namine
OpenCart modification parser.
Made to parse modifications from dev files.
So for the start you need two versions of your project: dev and work.

In dev you are writing your modifications with certain commentaries.
Then you starting this script for parse modification from dev files.
And after that you install your modification on working site as usual modification.

## Quick install
```
npm install namine

```

## Syntax examples

Modification for .php files:
```
...
//-nmn MODIFICATION_NAME pos:"POSITION" line: LINE
MODIFICATION_TEXT
//-nmn
...
```

Modification for .tpl and .twig files:
```
...
<!--//-nmn MODIFICATION_NAME pos:"POSITION" line: LINE-->
MODIFICATION_TEXT
<!--//-nmn-->
...
```
* MODIFICATION_NAME - name of your modification without spaces
* POSITION - position of modification (after, before, replace)
* LINE - line after, before or replaced of your modification
* MODIFICATION_TEXT - just your modification

### test.js

```
var namine = require('namine');

namine.makeModification({
	name:'hello',
	author:'test_author',
	link:'test.com',
	version:'0.1',
});
```

#### makeModification() options

* name - Name of modification in xml file. Default: 'test'
* author - Author of modification in xml file. Default: 'Author'
* link - Custom link of modification in xml file. Default: ''
* version - Version of modification in xml file. Default: '0.1'
* code - Code of saving modification file. Default: modification_name default value or set value
* modification_path - Path of saving modification file. Default: './'
* rewrite - Allow script to rewrite output file if it's exists. Default: false

## Example

Writing modification in php file:

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

Writing modification in tpl file:

### catalog/view/theme/default/template/product/product.tpl
```
...
<?php if ($review_status) { ?>
<!--//-nmn hello pos:"after" line: <?php if ($review_status) { ?>-->
<?php echo $hello . ' ' . $hello2;?>
<!--//-nmn-->
...
```

### test.js

```
var namine = require('namine');

namine.makeModification({
	name:'hello',
	author:'test_author',
	link:'test.com',
	version:'0.1',
});
```

Run node script like this:
```
node test.js
```

Script starting searching for modification and creating modification ocmod file.

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
			<search><![CDATA[<?php if ($review_status) { ?>]]></search>
			<add position="after"><![CDATA[
	<?php echo $hello1 . ' ' . $hello2;?>
	]]></add>
		</operation>
	</file>

</modification>
```
