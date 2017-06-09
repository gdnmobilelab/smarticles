var fs = require('fs-extra');
var sass = require('node-sass');
var handlebars = require('handlebars');
var getData = require('./data.js');

fs.removeSync('.build');
fs.mkdirsSync('.build');

var data = getData();

