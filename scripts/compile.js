var fs = require('fs-extra');
var glob = require('glob-fs')({ gitignore: true });
var sass = require('node-sass');
var handlebars = require('handlebars');
var getData = require('./data.js');

fs.removeSync('.build');
fs.mkdirsSync('.build');

var data = getData();
var html = fs.readFileSync('src/templates/index.html', 'utf8');

var partials = glob.readdirSync('src/templates/**/*.html');
partials.forEach(function (partial) {
    var name = partial.replace('src/templates/', '').split('.')[0];
    console.log(name);
    var template = fs.readFileSync(partial, 'utf8');
    handlebars.registerPartial(name, template);
});

handlebars.registerHelper("switch", function(value, options) {
  this._switch_value_ = value;
  var html = options.fn(this); // Process the body of the switch block
  delete this._switch_value_;
  return html;
});

handlebars.registerHelper("case", function(value, options) {
  if (value == this._switch_value_) {
    return options.fn(this);
  }
});

var template = handlebars.compile(html);
fs.writeFileSync('.build/index.html', template({atoms: data}));

var css = sass.renderSync({
    file: 'src/sass/styles.scss'
}).css.toString('utf8');

fs.writeFileSync('.build/styles.css', css);

fs.copySync('src/assets/', '.build/assets/');
