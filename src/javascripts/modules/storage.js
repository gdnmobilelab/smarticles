var $ = require('../vendor/jquery.js');
var visible = require('../vendor/jquery.visible.js');
var analytics = require('../modules/analytics');

var timers = {},
    analyticsTimers = {};

module.exports = {
    init: function() {
        this.set('lastVisited', new Date());
        this.bindings();
        this.increaseVisitCount();
        this.checkAtomsInView();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.checkAtomsInView();
        }.bind(this));
    },

    checkAtomsInView: function() {
        $('.atom').each(function(i, el) {
            var id = $(el).attr('data-id');
            if ($(el).visible(true)) {

                if (!analyticsTimers[id]) {
                    analyticsTimers[id] = new Date();
                    analytics.send('Atom Engagement', 'Show', id, '', $(el).attr('data-weight'), $(el).attr('data-type'));
                }

                if (!$(el).hasClass('has-read') && !timers[id]) {

                    timers[id] = setTimeout(function() {
                        if ($(el).visible()) {
                            $(el).addClass('has-read');

                            var seen = this.get('seen');

                            var object = {
                                id: id,
                                time: seen[id] ? seen[id].time : new Date(),
                                seen: seen[id] ? seen[id].seen + 1 : 1
                            };

                            if (!seen) {
                                seen = {};
                            }

                            seen[id] = object;
                            this.set('seen', seen);
                        } else {
                            clearTimeout(timers[id]);
                            delete timers[id];
                        }
                    }.bind(this), parseInt($(el).attr('data-time-until-read')));
                }
            } else if (!$(el).visible() && analyticsTimers[id]) {
                var delta = new Date() - analyticsTimers[id];

                analytics.send('Atom Engagement', 'Time', id, delta, $(el).attr('data-weight'), $(el).attr('data-type'));

                delete analyticsTimers[id];
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

        if (current[key]) {
            return current[key];
        } else {
            return false;
        }
    }
}