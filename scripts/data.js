var request = require('sync-request');
var chalk = require('chalk');
var config = require('./config.js').config;

module.exports = function(useLocalAPI) {
    var path = useLocalAPI == 'true' ? 'http://localhost:3000' : 'https://bob.gdnmobilelab.com';
    console.log(chalk.green('Using API at ' + path));

    var res = request('GET', path + '/?id=' + config.id + '&seen=1,2,4,12');
    var data = JSON.parse(res.body.toString());
        data.isDebug = useLocalAPI;

    return data;
};
