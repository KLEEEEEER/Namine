var fs = require('fs');
var path = require('path');
"use strict";
var extension_name = 'NAME';
var filt = new RegExp("//-nmn "+extension_name+"((\\s*).*(\\s*))//-nmn", 'gmu');
var write_filename = './modifications/'+extension_name+'.ocmod.xml';

function writeModificationFileStart() {
	// console.log('writeModificationFileStart');
	var start_string = `<?xml version="1.0" ?>
<!DOCTYPE modification [
	]>
<modification>
	<name>`+extension_name+`</name>
	<version>0.1</version>
	<author></author>
	<link></link>
	<code></code>`;
	fs.writeFileSync(write_filename, start_string, function(err){
		if (err) throw err;
	});
}

function writeModificationFileEnd() {
	// console.log('writeModificationFileEnd');
	var end_string = `
</modification>`;
	fs.appendFileSync(write_filename, end_string, function(err){
		if (err) throw err;
	});
}

function writeModificationFile(filename, modifications_array) {
	// console.log('writeModificationFile');
	var data = '';

	for (var key in modifications_array) {
		if (modifications_array.hasOwnProperty(key)) {
			if (modifications_array[key][0] !== undefined && modifications_array[key][1] !== undefined) {
				data += `	<file path="`+key+`">
		<operation>
			<search>
				<![CDATA[`;
				data += `]]></search>
			<add position="before"><![CDATA[`;
				// data += 'Character: ' + modifications_array[key][0] + ' ' + modifications_array[key][1] + '\n';
				data += modifications_array[key][1];
				data += `]]></add>
		</operation>
	</file>`;
				data+='\n';
			}
		}
	}

	// fs.writeFile(write_filename, data, function(err){
	fs.appendFileSync(write_filename, data, function(err){
		if (err) throw err;
	});
}

function fromDir(startPath, filter, filelist){
	if (!fs.existsSync(startPath)){
		console.log("no dir ",startPath);
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

var file_list = fromDir('./','.php');

writeModificationFileStart();
for (var i=0; i<file_list.length; i++) {
	(function(filename){
		var contents = fs.readFileSync(filename);
		var modifications;
		var match;
		while ((match = filt.exec(contents)) !== null) {
			modifications = [];
			modifications[filename] = [];
			modifications[filename].push(match['index'], match[1]);
			writeModificationFile(filename, modifications);
		}

	})(file_list[i]);
}
writeModificationFileEnd();
