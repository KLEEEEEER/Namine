"use strict";

var fs = require('fs');
var path = require('path');
var uniqid = require('uniqid');

let cache = require('./includes/cache');
let template = require('./includes/template');

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
  this.options.filt = new RegExp('//-nmn '+ this.options.modification_name+' pos:"(.*)" line: (.*)[\r\n|\r|\n]([\\s\\S]*?)//-nmn', 'gmu');
	this.options.filt_html = new RegExp('<!--//-nmn '+ this.options.modification_name+' pos:"(.*)" line: (.*)-->([\\s\\S]*?)<!--//-nmn-->', 'gmu');
}

Namine.prototype.countModifications = function() {
  var modifications = this._getAllModifications();
  return modifications.length;
}

Namine.prototype.makeModification = function() {

}

Namine.prototype._getAllModifications = function() {
  return [];
}

module.exports = Namine;
