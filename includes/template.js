var fs = require('fs');

function Template(options) {
  this.options = Object.assign({
    templates_dir:'./templates',
	}, options);
}

Template.prototype.getTemplatedContent = function(template_name, data) {
  let template_full_path = __dirname + '/../templates/'+template_name+'.xml';
  if (!fs.existsSync(template_full_path)) {
    console.log('There is no template named '+template_name+'.');
    return false;
  }
  var template_content = fs.readFileSync(template_full_path).toString();
  for (let key in data) {
    template_content = template_content.replace('{{'+key+'}}', data[key]);
  }
  return template_content;
}

module.exports = Template;
