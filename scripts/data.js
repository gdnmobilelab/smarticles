var request = require('sync-request');
var fs = require('fs-extra');
var config = require('./config.js').config;

var data;

function createTimeStamps(atoms) {
    for (var i in atoms) {
        var date = atoms[i].date.split('/');
        atoms[i].timeStamp = new Date(date[1] + '/' + date[0] + '/' + date[2] + ' ' + atoms[i].time);
    }

    return atoms;
}

function sortDevData() {
    var days = {};

    for (var i in data) {
        if (i !== 'Master' && i !== 'Stubs') {
            var atoms = createTimeStamps(data[i]);
            days[i] = {
                atoms: atoms
            }
        }
    }

    data = {days: days};
}

module.exports = function() {
    data = request('GET', config.dataUrl);
    data = JSON.parse(data.getBody('utf8'));
    // Production data
    // data = data.sheets.Master;
    // createTimeStamps(data);

    // Dev Data
    data = data.sheets;
    sortDevData();
    console.log(data);

    return data;
};
