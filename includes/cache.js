var fs = require('fs');
var uniqid = require('uniqid');

function Cache(options) {
  this.options = options;
  if (!this.options.cache_dir) {
    console.log('No cache_dir');
    return false;
  }
  if (!this.options.modification_name) {
    console.log('No modification_name');
    return false;
  }
}

Cache.prototype.saveModificationsInFile = function(modifications) {
  if (this.options.cache_dir && this.options.modification_name) {
    if (!fs.existsSync(this.options.cache_dir)){
        fs.mkdirSync(this.options.cache_dir);
    }
    fs.writeFileSync(this.options.cache_dir + this.options.modification_name + '.cache.json', JSON.stringify(modifications), function(err){
      if (err) throw err;
    });
  } else {
    console.log('Option cache_dir is not set.');
  }
}

Cache.prototype.getContentFromCache = function(filename) {
  var contents = JSON.parse(fs.readFileSync(filename));
  if (contents) {
    return contents
  } else {
    console.log('No contents in ' + filename);
    return false;
  }
}

Cache.prototype.replaceContentWithId = function(content) {
  var id = uniqid();

  return id;
}

Cache.prototype.replaceIdWithContent = function() {

}
