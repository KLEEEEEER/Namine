"use strict";

var fs = require('fs');
var path = require('path');
var uniqid = require('uniqid');
let prettifyXml = require('prettify-xml')

let cache = require('./includes/cache');
let Template = require('./includes/template');

function Namine(options) {
  this.options = Object.assign({
    modification_name:'test',
    author: 'Author',
    link: '',
    version: '0.1',
    modification_path: './',
    code: this.modification_name,
    rewrite: false,
    cache_dir: false,
	}, options);
  this.options.write_filename = this.options.modification_path +
  this.options.modification_name+'.ocmod.xml';
  this.options.php_filter = new RegExp('//-nmn '+ this.options.modification_name+' pos:"(.*)" line: (.*)[\r\n|\r|\n]([\\s\\S]*?)//-nmn', 'gmu');
	this.options.html_filter = new RegExp('<!--//-nmn '+ this.options.modification_name+' pos:"(.*)" line: (.*)-->([\\s\\S]*?)<!--//-nmn-->', 'gmu');
}

Namine.prototype.countModifications = function() {
  var modifications = this._getAllModifications();
  // TODO: Доделать функцию рассчёта
  return modifications.length;
}

Namine.prototype.makeModification = function() {
  let modifications = this._getAllModifications();
  this._writeModificationFile(modifications);
}

Namine.prototype._getAllModifications = function() {
  let modifications = {};

  modifications = Object.assign(modifications, this._getModifications({
    dir: 'catalog',
    extension: 'php',
    filter: this.options.php_filter
  }) );

  modifications = Object.assign(modifications, this._getModifications({
    dir: 'catalog',
    extension: 'tpl',
    filter: this.options.html_filter
  }) );

  modifications = Object.assign(modifications, this._getModifications({
    dir: 'catalog',
    extension: 'twig',
    filter: this.options.html_filter
  }) );

  modifications = Object.assign(modifications, this._getModifications({
    dir: 'admin',
    extension: 'php',
    filter: this.options.php_filter
  }) );

  modifications = Object.assign(modifications, this._getModifications({
    dir: 'admin',
    extension: 'tpl',
    filter: this.options.html_filter
  }) );

  modifications = Object.assign(modifications, this._getModifications({
    dir: 'admin',
    extension: 'twig',
    filter: this.options.html_filter
  }) );

  return modifications;
}

Namine.prototype._getModifications = function(options) {
  if (!options.dir) return false;
  if (!options.extension) return false;
  if (!options.filter) return false;

  let list= fromDir(this.options.modification_path + options.dir + '/','.'+options.extension);

  let modifications = {};

  for (var i=0; i<list.length; i++) {
			modifications = Object.assign(modifications, (function(filename, _this, filter){
				let contents = fs.readFileSync(filename);
				let modifications;
				let match;
				modifications = [];
				while ((match = filter.exec(contents)) !== null) {
					if (modifications[filename] === undefined) modifications[filename] = [];
					modifications[filename].push([ match['index'], match[3], match[1], match[2] ]);
				}
				return modifications;

			})(list[i], this, options.filter) );
		}

  return modifications;
}

Namine.prototype._getModificationFileContent = function(modifications) {
  let modification_file_template = '';
  let modifications_template = '';

  let template = new Template();

  for (let filename in modifications) {
    modifications_template = '';
    for (let modification in modifications[filename]) {
      modifications_template += template.getTemplatedContent('modification', {
        'search_string'        : modifications[filename][modification][3]
                                          .replace('<\\?php', '<?php')
                                          .replace('<\\?', '<?')
                                          .replace('?\\>', '?>')
                                          .replace('php?\\>', 'php?>'),
        'position'             : modifications[filename][modification][2],
        'modification_content' : modifications[filename][modification][1],
      });
    }
    modification_file_template += template.getTemplatedContent('modification_file', {
      'file_path'              : filename.replace(/\\/g, '/').replace(/theme\/(.*)\/template/g, 'theme/*/template'),
      'modifications_template' : modifications_template,
    });
  }

  let ocmod_content = template.getTemplatedContent('main', {
    'modification_name': this.options.modification_name,
    'version': this.options.version,
    'author': this.options.author,
    'link': this.options.link,
    'code': this.options.code,
    'modifications': modification_file_template,
  });

  return prettifyXml(ocmod_content,{indent: 2, newline: '\n'});
}

Namine.prototype._writeModificationFile = function(modifications) {
  let content = this._getModificationFileContent(modifications);
  fs.writeFileSync(this.options.write_filename, content, function(err){
    if (err) throw err;
  });
}

function fromDir(startPath, filter, filelist){
  if (!fs.existsSync(startPath)){
    return;
  }
  filelist = filelist || [];
  var files=fs.readdirSync(startPath,{'withFileTypes':true});
  for(var i=0;i<files.length;i++){
    var filename = '';
    if (files[i]['name']) {
      filename=path.join(startPath,files[i]['name']);
    } else {
      filename=path.join(startPath,files[i]);
    }
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
      fromDir(filename,filter,filelist);
    }
    else if (filename.indexOf(filter)>=0) {
      filelist.push(filename);
    }
  }
  return filelist;
}

module.exports = Namine;
