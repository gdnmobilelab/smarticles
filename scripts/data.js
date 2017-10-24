var request = require('sync-request');
var config = require('./config.js');

module.exports = function() {
    var res = request('GET', 'http://localhost:3000/?id=' + config.id + '&seen=1,2,4,12');

    return JSON.parse(res.body.toString());
};
