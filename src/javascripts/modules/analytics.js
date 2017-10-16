var $ = require('../vendor/jquery.js');
var ga = require('ga-browser')();

module.exports = {
    init: function() {
        this.loadGoogleAnalytics();
    },

    loadGoogleAnalytics: function() {
        ga('create', 'UA-77348538-9', 'auto');
    }
}

