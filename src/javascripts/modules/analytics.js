var $ = require('../vendor/jquery.js');

var id = 'UA-77348538-9',
    atomsPresented;

module.exports = {
    init: function() {
        this.setValues();
        this.bindings();
    },

    setValues: function() {
        atomsPresented = $('.atom').length;
    },

    bindings: function() {
        $('a.is-tracked').click(function(e) {
            e.preventDefault();
            var url = $(e.currentTarget).attr('href');
            this.externalLink(url);
        }.bind(this));
    },

    send: function(category, action, label, value = 0, weight = null, type = null) {
        window.ga('send', 'event', category, action, label, value, {
            // custom dimensions are setup within GA
            'dimension1': id,
            'dimension2': atomsPresented,
            'dimension3': weight,
            'dimension4': type,
        })
    },

    externalLink: function(url) {
        window.ga('send', 'event', 'outbound', 'click', url, {
            'transport': 'beacon',
            'hitCallback': function() { document.location = url; }
        });
    }
}

