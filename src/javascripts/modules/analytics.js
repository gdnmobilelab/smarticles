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

    send: function(category, action, label, value, weight = null, type = null) {
        console.log(category);
        console.log(action);
        console.log(label);
        console.log(value);
        console.log(weight);
        console.log(type);

        window.ga('send', 'event', category, action, label, value, {
            'id': id,
            'atomsPresented': atomsPresented,
            'atomWeight': weight,
            'atomType': type,
        })
    }
}