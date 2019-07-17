var assert = require('assert');
var Namine = require('../namineJs.js');
var fs = require('fs');

var namine = new Namine({
  'modification_name': 'test',
  'rewrite': true,
  'author': 'test author',
  'link': 'test link',
  'version': '0.1',
  'code': 'test_code',
  'modification_path': './test/',
  'cache_dir': './test/cache/',
});

namine.makeModification();
//namine.getNumberOfModifications();
//namine.writeJsonModification();

// console.log( namine._getTemplatedContent('main', {
//   'modification_name': 'ass',
//   'version': 'assversion',
//   'author': 'assauthor',
//   'link': 'asslink',
//   'code': 'asscode',
// }).toString('utf8') );

//console.log(namine._getAllModifications());

describe('Functions', function() {
    it('Generated xml should be equals to test_expected file', function() {
      var file_buffer = fs.readFileSync('./test/test.ocmod.xml', 'utf8').toString();
      var expected_string = fs.readFileSync('./test/test_expected.ocmod.xml', 'utf8').toString();
      assert.equal(file_buffer, expected_string);
    });
});
