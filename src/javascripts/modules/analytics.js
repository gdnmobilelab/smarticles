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
            'id': id,
            'atomsPresented': atomsPresented,
            'atomWeight': weight,
            'atomType': type,
        })
    }
}
