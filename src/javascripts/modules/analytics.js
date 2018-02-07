var $ = require('../vendor/jquery.js');
var uniqid = require('uniqid');

var id, atomsPresented;

module.exports = {
    init: function() {
        this.setUserId();
        this.setValues();
        this.bindings();
    },

    setUserId: function() {
        id = this.getUserId();
        window.ga('set', 'userId', id);
    },

    getUserId: function() {
        var idInStorage = localStorage.getItem('userId');

        if (idInStorage) {
            return idInStorage;
        } else {
            var newId = uniqid();
            localStorage.setItem('userId', newId);
            return newId;
        }
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

