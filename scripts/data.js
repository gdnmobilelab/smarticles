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

function orderByGroup(atoms) {
    // put all atoms into objects
    var groupedAtoms = {};
    var nonGroupedKey = 0;

    // Fix the hell out of this hot hot mess
    for (var i in atoms) {
        var groupName = atoms[i].group;

        if (atoms[i].group) {
            if (groupedAtoms[groupName]) {
                groupedAtoms[groupName].atoms[Object.keys(groupedAtoms[groupName].atoms).length + 1] = atoms[i];
            } else {
                groupedAtoms[groupName] = {};
                groupedAtoms[groupName].groupName = groupName;
                groupedAtoms[groupName].groupType = atoms[i].groupType;
                
                groupedAtoms[groupName].atoms = {};
                groupedAtoms[groupName].atoms[0] = atoms[i];
            }
        } else {
            groupedAtoms['group' + nonGroupedKey] = {atoms: {
                0: atoms[i]
            }};
            nonGroupedKey++;
        }
    }

    return groupedAtoms;
}

function sortDevData() {
    var days = {};

    for (var i in data) {
        if (i !== 'Master' && i !== 'Stubs') {
            var atoms = createTimeStamps(data[i]);
                atoms = orderByGroup(data[i]);
            days[i] = {
                groups: atoms
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
    // orderByGroup(data);

    // Dev Data
    data = data.sheets;
    sortDevData();
    
    fs.writeFileSync('.build/data.json', JSON.stringify(data.days['08/05/2017']));

    // console.log(data.days['08/05/2017']);

    return data;
};
