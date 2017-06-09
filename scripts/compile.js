var fs = require('fs-extra');
var glob = require('glob-fs')({ gitignore: true });
var sass = require('node-sass');
var handlebars = require('handlebars');
var getData = require('./data.js');

fs.removeSync('.build');
fs.mkdirsSync('.build');

var data = getData();
var html = fs.readFileSync('src/templates/index.html', 'utf8');
var template = handlebars.compile(html);

var partials = glob.readdirSync('src/templates/**/*.html');
partials.forEach(function (partial) {
    var name = partial.replace(/^.*[\\\/]/, '').split('.')[0];
    var template = fs.readFileSync(partial, 'utf8');
    handlebars.registerPartial(name, template);
});

fs.writeFileSync('.build/index.html', template({atoms: data}));