"use strict";

var fs = require('fs');
var path = require('path');
let prettifyXml = require('prettify-xml')
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
    directories: [
      {dir: 'catalog', extension: 'php'},
      {dir: 'catalog', extension: 'tpl'},
      {dir: 'catalog', extension: 'twig'},
      {dir: 'admin', extension: 'php'},
      {dir: 'admin', extension: 'tpl'},
      {dir: 'admin', extension: 'twig'},
    ]
	}, options);
  this.options.write_filename = this.options.modification_path +
  this.options.modification_name+'.ocmod.xml';
  this.options.php_filter = new RegExp('//-nmn '+ this.options.modification_name+' pos:"(.*)" line: (.*)[\r\n|\r|\n]([\\s\\S]*?)//-nmn', 'gmu');
	this.options.html_filter = new RegExp('<!--//-nmn-html '+ this.options.modification_name+' pos:"(.*)" line: (.*)-->([\\s\\S]*?)<!--//-nmn-html-->', 'gmu');
}

Namine.prototype.getNumberOfModifications = function() {
  var modifications = this._getAllModifications();
  return this._countModifications(modifications);
}

Namine.prototype.makeModification = function() {
  let modifications = this._getAllModifications();
  this._writeModificationFile(modifications);
}

Namine.prototype._getAllModifications = function() {
  let modifications = {};

  for (let key in this.options.directories) {
    if (this.options.directories[key].dir && this.options.directories[key].extension)
      modifications = Object.assign(modifications, this._getModifications({
        dir: this.options.directories[key].dir,
        extension: this.options.directories[key].extension
      }) );
  }

  return modifications;
}

Namine.prototype._countModifications = function(modifications_object) {
  let count = 0;
  for (let filename in modifications_object) {
    for (let modification in modifications_object[filename]) {
      count++;
    }
  }
  return count;
}

Namine.prototype._getModifications = function(options) {
  if (!options.dir) return false;
  if (!options.extension) return false;

  let list= fromDir(this.options.modification_path + options.dir + '/','.'+options.extension);

  let modifications = {};

	modifications = this._findModificationsByFilter(list, this.options.php_filter, modifications);
	modifications = this._findModificationsByFilter(list, this.options.html_filter, modifications);

  return modifications;
}

Namine.prototype._findModificationsByFilter = function(list, filter, modifications_obj) {
	let modifications_obj_temp = modifications_obj;
	if (list !== undefined)
		for (var i=0; i<list.length; i++) {
			let modifications = {};
			modifications = (function(filename, _this, filter){
				let contents = fs.readFileSync(filename);
				let modifications;
				let match;
				modifications = [];
				while ((match = filter.exec(contents)) !== null) {
					if (modifications[filename] === undefined) modifications[filename] = [];
					modifications[filename].push([ match['index'], match[3], match[1], match[2] ]);
				}
				return modifications;
			})(list[i], this, filter);
			if (Object.keys(modifications).length > 0) {
				let object_values = Object.values(modifications[list[i]]);
				if (modifications_obj_temp.hasOwnProperty(list[i])) {
					Array.prototype.push.apply(modifications_obj_temp[list[i]], object_values);
				} else {
					modifications_obj_temp[list[i]] = modifications[list[i]];
				}
			}
		}
  return modifications_obj;
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
