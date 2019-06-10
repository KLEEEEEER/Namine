"use strict";

var fs = require('fs');
var path = require('path');

function Namine(options) {
  this.options = Object.assign({
    modification_name:'test',
    author: 'Author',
    link: '',
    version: '0.1',
    modification_path: './',
    code: this.modification_name,
    rewrite: false,
	}, options);
  this.options.write_filename = this.options.modification_path +
  this.options.modification_name+'.ocmod.xml';
  this.options.filt = new RegExp('//-nmn '+ this.options.modification_name+' pos:"(.*)" line: (.*)[\r\n|\r|\n]([\\s\\S]*?)//-nmn', 'gmu');
	this.options.filt_html = new RegExp('<!--//-nmn '+ this.options.modification_name+' pos:"(.*)" line: (.*)-->([\\s\\S]*?)<!--//-nmn-->', 'gmu');
}

Namine.prototype._findMatch = function(list, filter) {
    let _this = this;
		for (var i=0; i<list.length; i++) {
			(function(filename, _this){
				var contents = fs.readFileSync(filename);
				var modifications;
				var match;
				modifications = [];
				while ((match = filter.exec(contents)) !== null) {
					if (modifications[filename] === undefined) modifications[filename] = [];
					modifications[filename].push([ match['index'], match[3], match[1], match[2] ]);
				}
				if (modifications[filename] !== undefined) {
					_this._writeModificationFile(filename, modifications);
				}
			})(list[i], _this);
		}
}

Namine.prototype._writeModificationFileEnd = function() {
    var end_string = `
</modification>`;
    fs.appendFileSync(this.options.write_filename, end_string, function(err){
      if (err) throw err;
    });
  }

Namine.prototype._writeModificationFileStart = function() {
  var start_string = `<?xml version="1.0" ?>
<!DOCTYPE modification []>
<modification>
  <name>`+this.options.modification_name+`</name>
  <version>`+this.options.version+`</version>
  <author>`+this.options.author+`</author>
  <link>`+this.options.link+`</link>
  <code>`+this.options.code+`</code>`;
  fs.writeFileSync(this.options.write_filename, start_string, function(err){
    if (err) throw err;
  });
}

Namine.prototype._writeModificationFile = function(filename, modifications_array) {
  var data = '\n';
  data += `		<file path="`+filename.replace(/\\/g, '/').replace(/theme\/(.*)\/template/g, 'theme/*/template')+`">`;
  for (var file in modifications_array) {
    if (modifications_array.hasOwnProperty(file))
      for (var file_path in modifications_array[file]) {
        if (file.hasOwnProperty(file_path)) {
          if ( modifications_array[file][file_path][0] !== undefined
            && modifications_array[file][file_path][1] !== undefined
            && modifications_array[file][file_path][2] !== undefined
            && modifications_array[file][file_path][3] !== undefined
          ) {
            data+='\n';
            data += `			<operation>
        <search><![CDATA[`;
            data += modifications_array[file][file_path][3]
                  .replace('<\\?php', '<?php')
                  .replace('<\\?', '<?')
                  .replace('?\\>', '?>')
                  .replace('php?\\>', 'php?>');
            data += `]]></search>
          <add position="`+modifications_array[file][file_path][2]+`"><![CDATA[`;
            data += modifications_array[file][file_path][1];
            data += `]]></add>
      </operation>`;
          }
        }
      }
  }
  data+='\n';
  data += `		</file>`;
  data+='\n';

  fs.appendFileSync(this.options.write_filename, data, function(err){
    if (err) throw err;
  });
}


Namine.prototype.makeModification = function() {
  let _this = this;

  if (!fs.existsSync("./catalog")) {
		console.log('There is no catalog directory. Script should be in root.');
		return;
	}
	if (!fs.existsSync("./admin")) {
		console.log('There is no admin directory. Script should be in root.');
		return;
	}
  if (fs.existsSync(this.write_filename) && !this.rewrite) {
		console.log('File ' + write_filename + ' already exists!');
		return;
	}

  var file_list_php = fromDir(this.options.modification_path + 'catalog/','.php');
	var file_list_tpl = fromDir(this.options.modification_path + 'catalog/','.tpl');
	var file_list_twig = fromDir(this.options.modification_path + 'catalog/','.twig');
	var admin_file_list_php = fromDir(this.options.modification_path + 'admin/','.php');
	var admin_file_list_tpl = fromDir(this.options.modification_path + 'admin/','.tpl');
	var admin_file_list_twig = fromDir(this.options.modification_path + 'admin/','.twig');

  this._writeModificationFileStart();
	this._findMatch(file_list_php, this.options.filt);
	this._findMatch(file_list_tpl, this.options.filt_html);
	this._findMatch(file_list_twig, this.options.filt_html);
	this._findMatch(admin_file_list_php, this.options.filt);
  this._findMatch(admin_file_list_tpl, this.options.filt_html);
	this._findMatch(admin_file_list_twig, this.options.filt_html);
	this._writeModificationFileEnd();
}

// https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs/25462405#25462405
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
