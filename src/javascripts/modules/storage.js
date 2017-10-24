var $ = require('../vendor/jquery.js');
var visible = require('../vendor/jquery.visible.js');

var timers = {};

module.exports = {
    init: function() {
        this.set('lastVisited', new Date());
        this.bindings();
        this.increaseVisitCount();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.checkAtomsInView();
        }.bind(this));
    },

    checkAtomsInView: function() {
        $('.atom').each(function(i, el) {
            if ($(el).visible()) {
                var id = $(el).attr('data-id');
                if (!$(el).hasClass('has-read') && !timers[id]) {

                    timers[id] = setTimeout(function() {
                        if ($(el).visible()) {
                            $(el).addClass('has-read');
                            console.log(id + ' has been read');
                        } else {
                            clearTimeout(timers[id]);
                            delete timers[id];
                        }
                    }.bind(this), 2000);
                }
            }
        }.bind(this));
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