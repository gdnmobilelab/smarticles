var request = require('sync-request');
var fs = require('fs-extra');
var deasync = require('deasync');

module.exports = function() {
    var isDone = false;
    var res = request('GET', 'http://localhost:3000/?id=13T6ddF73l9EtESaIjppzWFfoq4RA_ihsl3y5WRm0Mxs&seen=1,2,4,12');

    return JSON.parse(res.body.toString());
};
