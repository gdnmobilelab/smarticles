var $ = require('../vendor/jquery.js');

var id = 'UA-77348538-9',
    atomsPresented;

module.exports = {
    init: function() {
        this.setValues();
    },

    setValues: function() {
        atomsPresented = $('.atom').length;
    },

    send: function(category, action, label, value = 0, weight = null, type = null) {
        window.ga('send', 'event', category, action, label, value, {
            // custom dimensions are setup within GA
            'dimension1': id,
            'dimension2': atomsPresented,
            'dimension3': weight,
            'dimension4': type,
        })
    }
}
