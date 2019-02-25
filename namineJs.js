exports.makeModification = function(options) {
  "use strict";
	var modification_name, author, link, version, modification_path;

	if (options) {
		modification_name = (options.hasOwnProperty('modification_name')) ? options['modification_name'] : 'test';
		author = (options.hasOwnProperty('author')) ? options['author'] : 'Author';
		link = (options.hasOwnProperty('link')) ? options['link'] : '';
		version = (options.hasOwnProperty('version')) ? options['version'] : '0.1';
		modification_path = (options.hasOwnProperty('modification_path')) ? options['modification_path'] : './';
	} else {
		modification_name = 'test';
		author = 'Author';
		link = '';
		version = '0.1';
		modification_path = './';
	}

	var fs = require('fs');
	var path = require('path');

	var filt = new RegExp('//-nmn '+modification_name+' pos:"(.*)" line: (.*)[\r\n|\r|\n]([\\s\\S]*?)//-nmn', 'gmu');
	var filt_html = new RegExp('<!--//-nmn '+modification_name+' pos:"(.*)" line: (.*)-->([\\s\\S]*?)<!--//-nmn-->', 'gmu');

	var write_filename = modification_path + modification_name+'.ocmod.xml';

	function writeModificationFileStart() {
		var start_string = `<?xml version="1.0" ?>
<!DOCTYPE modification []>
<modification>
	<name>`+modification_name+`</name>
	<version>`+version+`</version>
	<author>`+author+`</author>
	<link>`+link+`</link>
	<code>`+modification_name+`</code>`;
		fs.writeFileSync(write_filename, start_string, function(err){
			if (err) throw err;
		});
	}

	function writeModificationFileEnd() {
		var end_string = `
</modification>`;
		fs.appendFileSync(write_filename, end_string, function(err){
			if (err) throw err;
		});
	}

	function writeModificationFile(filename, modifications_array) {
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
										.replace('\\?>', '?>')
										.replace('php\\?>', 'php?>');
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

		fs.appendFileSync(write_filename, data, function(err){
			if (err) throw err;
		});
	}

	// https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs/25462405#25462405
	function fromDir(startPath, filter, filelist){
		if (!fs.existsSync(startPath)){
			// console.log("no dir ",startPath);
			return;
		}
		filelist = filelist || [];
		var files=fs.readdirSync(startPath,{'withFileTypes':true});
		for(var i=0;i<files.length;i++){
			var filename=path.join(startPath,files[i]);
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

	// TODO: Refactor
	var file_list_php = fromDir('./catalog/','.php');
	var file_list_tpl = fromDir('./catalog/','.tpl');
	var file_list_twig = fromDir('./catalog/','.twig');
	var admin_file_list_php = fromDir('./admin/','.php');
	var admin_file_list_tpl = fromDir('./admin/','.tpl');
	var admin_file_list_twig = fromDir('./admin/','.twig');

	function findMatch(list, filter) {
		for (var i=0; i<list.length; i++) {
			(function(filename){
				// console.log('Searching in ' + filename);
				var contents = fs.readFileSync(filename);
				var modifications;
				var match;
				modifications = [];
				while ((match = filter.exec(contents)) !== null) {
					if (modifications[filename] === undefined) modifications[filename] = [];
					modifications[filename].push([ match['index'], match[3], match[1], match[2] ]);
				}
				if (modifications[filename] !== undefined) {
					writeModificationFile(filename, modifications);
				}
			})(list[i]);
		}
	}

	writeModificationFileStart();
	findMatch(file_list_php, filt);
	findMatch(file_list_tpl, filt_html);
	findMatch(file_list_twig, filt_html);
	findMatch(admin_file_list_php, filt);
	findMatch(admin_file_list_tpl, filt_html);
	findMatch(admin_file_list_twig, filt_html);
	writeModificationFileEnd();
};
