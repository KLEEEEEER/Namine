var assert = require('assert');
var namine = require('../namineJs.js');
var fs = require('fs');

namine.makeModification({
  'name': 'test',
  'rewrite': true,
  'author': 'test author',
  'link': 'test link',
  'version': '0.1',
  'code': 'test_code',
});

describe('Functions', function() {
    it('Generated xml should be equals to test_expected file', function() {
      var file_buffer = fs.readFileSync('./test/test.ocmod.xml', 'utf8').toString();
      var expected_string = fs.readFileSync('./test/test_expected.ocmod.xml', 'utf8').toString();
      assert.equal(file_buffer, expected_string);
    });
});
