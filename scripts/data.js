var request = require('sync-request');
var chalk = require('chalk');
var config = require('./config.js').config;

module.exports = function(useLocalAPI) {
    var path = useLocalAPI == 'true' ? 'http://localhost:3000' : 'https://bob.gdnmobilelab.com';
    console.log(chalk.green('Using API at ' + path));
    console.log(chalk.green('Using spreadsheet Id ' + config.id));

    var res = request('POST', path, { json: {
        'id': config.id,
        'seen': ''
    }});

    var data = JSON.parse(res.body.toString());
        data.useLocalAPI = useLocalAPI;

    return data;
};
 