var fs = require('fs-extra');
var sass = require('node-sass');
var handlebars = require('handlebars');
var getData = require('./data.js');

fs.removeSync('.build');
fs.mkdirsSync('.build');

var data = getData();
var html = fs.readFileSync('src/templates/index.html', 'utf8');
var template = handlebars.compile(html);
fs.writeFileSync('.build/index.html', template({atoms: data}));