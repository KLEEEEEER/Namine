# Namine

## Description
This script was created to make it easier to write OpenCart modifications and initially develop the code for its modifications immediately in the site files. It collects all the pieces of your modifications into a .ocmod.xml file, which you can install on your production site as usual.

## Initial settings

In order to start working with Namine you need:

1. Expand a copy of your site to develop modifications. This is necessary so as not to modify files directly in the working folders.

2. Install Namine in the root directory of a copy of your development site.
```
npm install namine

```
3. Create a file that will run Namine. Create the namine.js file in the root directory with the following contents:

```
var Namine = require('namine');

var namine = new Namine({
  'modification_name': 'test',
  'rewrite': true,
  'author': 'test author',
  'link': 'test link',
  'version': '0.1',
  'code': 'test_code',
});

namine.makeModification();
```
#### New Namine() initialization options

**modification_name** - (string) The name of the modification. Used to search for modifications in files.

**rewrite** - (true|false) Permission to overwrite the .ocmod.xml modification file.

**author** - (string) Name of the author of the modification.

**link** - (string) Link to the modification site or author's site.

**version** - (string) Modification version number.

**code** - (string) Unique modification code. Used for identification in OpenCart.

**directories** - (array) An array for specifying search directories for modifications and search extensions.

> Default directories option array:
>```
>directories: [
>      {dir: 'catalog', extension: 'php'},
>      {dir: 'catalog', extension: 'tpl'},
>      {dir: 'catalog', extension: 'twig'},
>      {dir: 'admin', extension: 'php'},
>      {dir: 'admin', extension: 'tpl'},
>      {dir: 'admin', extension: 'twig'},
>    ]
>```

## Writing modifications

In order for Namine to understand where the modifications are in the code, they need to be wrapped in a specific syntax. For certain file extensions, certain syntax is used.

### php
```
//-nmn name pos:"before" line: <\?php echo "test php string"; ?\>
Modification Content
//-nmn
```
**name** - Modification name

**before** - Modification position. The position may be:
* before
* after
* replace

[Positions in OpenCart Modifications](https://github.com/opencart/opencart/wiki/Modification-System#add)

**<\\?php echo "test php string"; ?\\>** - The line with which work is being conducted.

> Symbols \<?php, \<? и \?> replacing by <\\?php, <\\? и ?\\> respectively. This is necessary so that the code does not run in the comment once again..

**Modification content** - Content modification (It doesn’t matter plain text or code).

Example:
```
//-nmn test pos:"after" line: <\?php This code will before modification! ?\>
Content after line
//-nmn
```
A modification called test. “Content after line” will be inserted after the line “<\? Php This code will be before modification! ? \> ”.

### twig and tpl

```
<!--//-nmn-html name pos:"before" line: <\?php This code will be after modification! ?\>-->
Content before line
<!--//-nmn-html-->
```
**name** - Modification name

**before** - Modification position. The position may be:
* before
* after
* replace

[Positions in OpenCart Modifications](https://github.com/opencart/opencart/wiki/Modification-System#add)

**<\\?php This code will be after modification! ?\\>** - The line with which work is being conducted.

> Symbols \<?php, \<? и \?> replacing by <\\?php, <\\? и ?\\> respectively. This is necessary so that the code does not run in the comment once again..

**"Content before line"** - Content modification (It doesn’t matter plain text or code).

Example:
```
<!--//-nmn-html name pos:"before" line: <\?php This code will be after modification! ?\>-->
Content before line
<!--//-nmn-html-->
```
A modification called test. “Content before line” will be inserted before the line “<\? Php This code will be after modification! ? \> ”.

# Complete example of a simple modification

## namine.js
```
var Namine = require('namine');

var namine = new Namine({
  'modification_name': 'my_first_modification',
  'rewrite': true,
  'author': 'KLEEEEEER',
  'link': 'https://github.com/KLEEEEEER',
  'version': '1.0',
  'code': 'my_first_modification',
});

namine.makeModification();
```

## catalog/controller/extension/module/account.php

```php
<?php
class ControllerExtensionModuleAccount extends Controller {
	public function index() {
		$this->load->language('extension/module/account');

		$data['heading_title'] = $this->language->get('heading_title');
		$data['text_register'] = $this->language->get('text_register');
		$data['text_login'] = $this->language->get('text_login');
		//-nmn my_first_modification pos:"after" line: $data['text_login'] = $this->language->get('text_login');
		$data['my_string'] = 'Test';
		//-nmn
		$data['text_logout'] = $this->language->get('text_logout');
		$data['text_forgotten'] = $this->language->get('text_forgotten');
		$data['text_account'] = $this->language->get('text_account');
		$data['text_edit'] = $this->language->get('text_edit');
		$data['text_password'] = $this->language->get('text_password');
		$data['text_address'] = $this->language->get('text_address');
		$data['text_wishlist'] = $this->language->get('text_wishlist');
		$data['text_order'] = $this->language->get('text_order');
		$data['text_download'] = $this->language->get('text_download');
		$data['text_reward'] = $this->language->get('text_reward');
		$data['text_return'] = $this->language->get('text_return');
		$data['text_transaction'] = $this->language->get('text_transaction');
		$data['text_newsletter'] = $this->language->get('text_newsletter');
		$data['text_recurring'] = $this->language->get('text_recurring');

		$data['logged'] = $this->customer->isLogged();
		$data['register'] = $this->url->link('account/register', '', true);
		$data['login'] = $this->url->link('account/login', '', true);
		$data['logout'] = $this->url->link('account/logout', '', true);
		$data['forgotten'] = $this->url->link('account/forgotten', '', true);
		$data['account'] = $this->url->link('account/account', '', true);
		$data['edit'] = $this->url->link('account/edit', '', true);
		$data['password'] = $this->url->link('account/password', '', true);
		$data['address'] = $this->url->link('account/address', '', true);
		$data['wishlist'] = $this->url->link('account/wishlist');
		$data['order'] = $this->url->link('account/order', '', true);
		$data['download'] = $this->url->link('account/download', '', true);
		$data['reward'] = $this->url->link('account/reward', '', true);
		$data['return'] = $this->url->link('account/return', '', true);
		$data['transaction'] = $this->url->link('account/transaction', '', true);
		$data['newsletter'] = $this->url->link('account/newsletter', '', true);
		$data['recurring'] = $this->url->link('account/recurring', '', true);

		return $this->load->view('extension/module/account', $data);
	}
}

```

## catalog/view/theme/default/template/extension/module/account.tpl

```php
<div class="list-group">
	<!--//-nmn-html my_first_modification pos:"after" line: <div class="list-group">-->
	<span><?php echo $my_string; ?></span>
	<!--//-nmn-html-->
  <?php if (!$logged) { ?>
  <a href="<?php echo $login; ?>" class="list-group-item"><?php echo $text_login; ?></a> <a href="<?php echo $register; ?>" class="list-group-item"><?php echo $text_register; ?></a> <a href="<?php echo $forgotten; ?>" class="list-group-item"><?php echo $text_forgotten; ?></a>
  <?php } ?>
  <a href="<?php echo $account; ?>" class="list-group-item"><?php echo $text_account; ?></a>
  <?php if ($logged) { ?>
  <a href="<?php echo $edit; ?>" class="list-group-item"><?php echo $text_edit; ?></a> <a href="<?php echo $password; ?>" class="list-group-item"><?php echo $text_password; ?></a>
  <?php } ?>
  <a href="<?php echo $address; ?>" class="list-group-item"><?php echo $text_address; ?></a> <a href="<?php echo $wishlist; ?>" class="list-group-item"><?php echo $text_wishlist; ?></a> <a href="<?php echo $order; ?>" class="list-group-item"><?php echo $text_order; ?></a> <a href="<?php echo $download; ?>" class="list-group-item"><?php echo $text_download; ?></a><a href="<?php echo $recurring; ?>" class="list-group-item"><?php echo $text_recurring; ?></a> <a href="<?php echo $reward; ?>" class="list-group-item"><?php echo $text_reward; ?></a> <a href="<?php echo $return; ?>" class="list-group-item"><?php echo $text_return; ?></a> <a href="<?php echo $transaction; ?>" class="list-group-item"><?php echo $text_transaction; ?></a> <a href="<?php echo $newsletter; ?>" class="list-group-item"><?php echo $text_newsletter; ?></a>
  <?php if ($logged) { ?>
  <a href="<?php echo $logout; ?>" class="list-group-item"><?php echo $text_logout; ?></a>
  <?php } ?>
</div>


```

After running the script, the output is in my_first_modification.ocmod.xml

## my_first_modification.ocmod.xml

```xml
<?xml version="1.0" ?>
<!DOCTYPE modification []>
<modification>
  <name>my_first_modification</name>
  <version>1.0</version>
  <author>KLEEEEEER</author>
  <link>https://github.com/KLEEEEEER</link>
  <code>my_first_modification</code>
  <file path="catalog/controller/extension/module/account.php">
    <operation>
      <search>
        <![CDATA[$data['text_login'] = $this->language->get('text_login');]]>
      </search>
      <add position="after">
        <![CDATA[		$data['my_string'] = 'Test';
        ]]>
      </add>
    </operation>
    
  </file>
  <file path="catalog/view/theme/*/template/extension/module/account.tpl">
    <operation>
      <search>
        <![CDATA[<div class="list-group">]]>
      </search>
      <add position="after">
        <![CDATA[
        <span>
          <?php echo $my_string; ?>
        </span>
        ]]>
      </add>
    </operation>
    
  </file>
  
</modification>
```

*"That's a piece of your memory, Sora. Call out to it!"*