var fs = require('fs');
var path = require('path');
"use strict"
var extension_name = 'NAME';
var filt = new RegExp("//-nmn "+extension_name+"((\\s*).*(\\s*))//-nmn", 'gmu');



// var walkSync = function(dir, filelist) {
// 	var fs = fs || require('fs'),
// 		files = fs.readdirSync(dir);
// 	filelist = filelist || [];
// 	files.forEach(function(file) {
// 		if (fs.statSync(dir + '/' + file).isDirectory()) {
// 			filelist = walkSync(dir + '/' + file, filelist);
// 		}
// 		else {
// 			filelist.push(file);
// 		}
// 	});
// 	return filelist;
// };
// var file_list = walkSync('./');
// console.log(file_list);

function writeModificationFile(filename, modifications_array) {
	var data = '';
	console.log(modifications_array);
	// for (var i=0; i<modifications_array.length; i++) {
	// 	data += modifications_array[i][1];
	// }
	modifications_array.forEach(function(item, i, arr){
		console.log('WHAT');
		data += i + '\n';
		data += item[0] + item[1] + '\n';
	});

	fs.writeFile('./modifications/modification1.txt', data, function(err){
		if (err) throw err;
		console.log('The file has been saved!');
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
			fromDir(filename,filter,filelist); //recurse
		}
		else if (filename.indexOf(filter)>=0) {
			filelist.push(filename);
		}
	}
	return filelist;
}

var file_list = fromDir('./','.php');

for (var i=0; i<file_list.length; i++) {

	(function(filename){
		fs.readFile(filename, 'utf8', function(err, contents) {
				var modifications = [];
				modifications[filename] = [];
				var match;
				while ((match = filt.exec(contents)) !== null) {
					modifications[filename].push(match['index'], match[1]);
					console.log(match[1]);
					writeModificationFile(filename, modifications);
				}
		});
	})(file_list[i]);
}
