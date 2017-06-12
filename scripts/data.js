var request = require('sync-request');
var fs = require('fs-extra');
var config = require('./config.js').config;

var data;

function createTimeStamps() {
    for (var i in data) {
        var date = data[i].date.split('/');
        data[i].timeStamp = new Date(date[1] + '/' + date[0] + '/' + date[2] + ' ' + data[i].time);
    }
}

function sortByReverseDate() {
    data.sort(function(a,b) {
        console.log(a.timeStamp);
        return b.timeStamp - a.timeStamp;
    });
}

module.exports = function() {
    data = request('GET', config.dataUrl);
    data = JSON.parse(data.getBody('utf8'));
    data = data.sheets.Sheet1;

    createTimeStamps();
    sortByReverseDate();

    return data;
};