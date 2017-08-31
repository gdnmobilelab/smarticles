var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        console.log(localStorage);
    },

    set: function(key, value) {
        localStorage.setItem($('body').attr('data-id') + '-' + key, value);
    },

    get: function(key) {
        return localStorage.getItem($('body').attr('data-id') + '-' + key);
    }
}