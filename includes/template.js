function Template(options) {
  this.options = Object.assign({
    templates_dir:'./templates',
	}, options);
}

Template.prototype.getTemplatedContent = function(template_name, data) {

}

module.exports = Template;
