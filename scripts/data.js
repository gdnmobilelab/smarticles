var request = require('sync-request');
var fs = require('fs-extra');
var config = require('./config.js').config;

var data;

function getFurniture(furniture) {
    var organisedFurniture = {}

    for (var i in furniture) {
        organisedFurniture[furniture[i].option] = furniture[i].value;
    }

    return organisedFurniture;
}

function createTimeStamps(atoms) {
    for (var i in atoms) {
        var date = atoms[i].date.split('/');
        atoms[i].timeStamp = new Date(date[1] + '/' + date[0] + '/' + date[2] + ' ' + atoms[i].time);
    }

    return atoms;
}

function getLastUpdated(atoms) {
    var lastUpdated = atoms[0].timeStamp;

    for (var i in atoms) {
        if (atoms[i].timeStamp > lastUpdated) {
            lastUpdated = atoms[i].timeStamp;
        }
    }

    return lastUpdated;
}

function addDynamicCharacters(atoms, characters) {
    for (var i in characters) {
        var html = '<span class=\'character character--' + i + '\'><span class=\'character__short\'>' + characters[i].shortName + '</span><span class=\'character__long\'>' + characters[i].longName + '</span></span>';
        var regex = new RegExp('character.' + characters[i].id , 'g');

        for (var atom in atoms) {
            atoms[atom].copy = atoms[atom].copy.replace(regex, html);
        }
    }

    return atoms;
}

function cleanType(atoms) {
    for (var i in atoms) {
        atoms[i].title = atoms[i].title.replace(/“/g, '&ldquo;').replace(/”/g, '&rdquo;').replace(/“/g, '&ldquo;').replace(/”/g, '&rdquo;');
        atoms[i].copy = atoms[i].copy.replace(/“/g, '&ldquo;').replace(/”/g, '&rdquo;').replace(/’/g, '&#8217;').replace(/—/g, '&mdash;');
    }

    return atoms;
}

function orderByGroup(atoms) {
    // put all atoms into objects
    var groupedAtoms = {};
    var nonGroupedKey = 0;

    for (var i in atoms) {
        var groupName = atoms[i].group;

        if (atoms[i].group) {
            if (groupedAtoms[groupName]) {
                groupedAtoms[groupName].atoms[Object.keys(groupedAtoms[groupName].atoms).length + 1] = atoms[i];
            } else {
                groupedAtoms[groupName] = {
                    groupName: groupName,
                    groupType: atoms[i].groupType,
                    isFaq: (atoms[i].isFaq == 'TRUE' ? true : false),
                    atoms: {
                        0: atoms[i]
                    }
                };
            }
        } else {
            groupedAtoms['group' + nonGroupedKey] = {
                isFaq: (atoms[i].isFaq == 'TRUE' ? true : false),
                atoms: {
                    0: atoms[i]
                }
            };
            nonGroupedKey++;
        }
    }

    return groupedAtoms;
}

module.exports = function() {
    // fetch data
    data = request('GET', config.dataUrl);
    data = JSON.parse(data.getBody('utf8'));

    // data structure
    data = {
        groups: data.sheets.Atoms,
        furniture: getFurniture(data.sheets.Furniture),
        characters: data.sheets.Characters,
        lastUpdated: new Date()
    }

    // manipulate and clean data
    data.groups = createTimeStamps(data.groups);
    data.lastUpdated = getLastUpdated(data.groups);
    data.groups = addDynamicCharacters(data.groups, data.characters);
    data.groups = cleanType(data.groups);
    data.groups = orderByGroup(data.groups);

    console.log(data.groups['Munoz Letter to Staff']);

    return data;
};
