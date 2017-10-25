var request = require('sync-request');
var config = require('./config.js');
var chalk = require( 'chalk' );

module.exports = function() {
    var path = config.local ? 'http://localhost:3000' : 'https://bob.gdnmobilelab.com'
    console.log(chalk.green('Using API at ' + path));
    var res = request('GET', path + '/?id=' + config.id + '&seen=1,2,4,12');

    return JSON.parse(res.body.toString());
};
