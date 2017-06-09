var request = require('sync-request');
var fs = require('fs-extra');
var config = require('./config.js').config;

var data;

module.exports = function() {
    data = request('GET', config.dataUrl);
    data = JSON.parse(data.getBody('utf8'));
    return data.sheets.Sheet1;
};