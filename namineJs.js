var fs = require('fs');

var extension_name = 'NAME';

// var filt = /\/\/-nmn extension_name((.|\s*).*(.|\s*))\/\/-nmn/gmu;
var filt = new RegExp("//-nmn extension_name((.*|\s*).*(.*|\s*))//-nmn", 'gmu');

fs.readFile('test.php', 'utf8', function(err, contents) {
	// console.log(contents);
	while ((match = filt.exec(contents)) !== null) {
		console.log(match[1])
	}
});

// fs.readFile('test2.php', 'utf8', function(err, contents) {
// 	console.log(contents);
// 	var filt2 = new RegExp('//-nmn //-nmn','gmu');
// 	while ((match = filt2.exec(contents)) !== null) {
// 		console.log(match[1])
// 	}
// });