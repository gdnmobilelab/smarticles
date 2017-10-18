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

function returnDynamicCharacterHtml(i, character, isEndOfSentence) {
    return '<span class=\'character character--' + i + '\'><span class=\'character__short\'>' + character.shortName + '</span><span class=\'character__long\'>' + character.longName + '</span></span>';
}

function addDynamicCharacters(atoms, characters) {
    for (var i in characters) {
        var characterPattern = new RegExp('character.' + characters[i].id , 'g');

        var hasSubClause = characters[i].longName.indexOf(',') !== -1 ? true : false;

        for (var atom in atoms) {
            if (!hasSubClause) {
                atoms[atom].copy = atoms[atom].copy.replace(characterPattern, returnDynamicCharacterHtml(i, characters[i], false));
            } else {
                while((match = characterPattern.exec(atoms[atom].copy))) {
                    var start = match.index;
                    var end = characterPattern.lastIndex;
                    var endOfSentence = atoms[atom].copy.substring(end, end + 2).match(/[\,\.]/) ? true : false;

                    atoms[atom].copy = atoms[atom].copy.substring(0, start) + returnDynamicCharacterHtml(i, characters[i], endOfSentence) + atoms[atom].copy.substring(end, atoms[atom].copy.length);
                }
            }
        }
    }

    return atoms;
}

function replaceMuck(string) {
    return string.replace(/“/g, '&ldquo;').replace(/”/g, '&rdquo;').replace(/’/g, '&rsquo;').replace(/—/g, '&mdash;').replace(/‘/g, '&lsquo;').replace(/–/g, '&ndash;');
}

function cleanType(atoms) {
    for (var i in atoms) {
        atoms[i].title = replaceMuck(atoms[i].title)
        atoms[i].copy = replaceMuck(atoms[i].copy)
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
                    groupName: replaceMuck(groupName),
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

function showWeighting(atoms) {
    if (data.furniture.showWeighting == 'TRUE') {
        for (var i in atoms) {
            atoms[i].showWeighting = true;
        }
    }

    return atoms;
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
    data.groups = showWeighting(data.groups);
    data.groups = orderByGroup(data.groups);

    return data;
};
