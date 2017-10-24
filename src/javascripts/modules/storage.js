var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        this.set('lastVisited', new Date());
        this.increaseVisitCount();
    },

    increaseVisitCount: function() {
        var visitCount = this.get('visit');

        if (visitCount) {
            this.set('visit', visitCount + 1);
        } else {
            this.set('visit', 1);
        }
    },

    read: function(slug) {
        var data = localStorage.getItem(slug);
        if (data) {
            return JSON.parse(data);
        } else {
            return {}
        }
    },

    set: function(key, value) {
        var slug = $('body').attr('data-slug');
        var current = this.read(slug);
            current[key] = value;
            current = JSON.stringify(current);

        localStorage.setItem(slug, current);
    },

    get: function(key) {
        var slug = $('body').attr('data-slug');
        var current = this.read(slug);

        return current[key];
    }
}