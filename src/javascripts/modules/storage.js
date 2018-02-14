var $ = require('../vendor/jquery.js');
var visible = require('../vendor/jquery.visible.js');
var analytics = require('../modules/analytics');

var timers = {},
    analyticsTimers = {};

module.exports = {
    init: function() {
        this.set('lastVisited', new Date());
        this.bindings();
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
            if ($(el).visible(true) && id !== '') {

                if (!analyticsTimers[id]) {
                    analyticsTimers[id] = new Date();
                    analytics.send('Atom Engagement', 'Show', id, 1, $(el).attr('data-weight'), $(el).attr('data-type'), $(el).parent().hasClass('group--is-reintroduced'));
                }

                if (!$(el).hasClass('has-read') && !timers[id]) {

                    timers[id] = setTimeout(function() {
                        if ($(el).visible()) {
                            $(el).addClass('has-read');

                            var seen = this.get('seen');

                            var object = {
                                id: id,
                                date: seen[id] ? seen[id].date : new Date(),
                                seen: seen[id] ? seen[id].seen + 1 : 1,
                                timeInView: seen[id] ? seen[id].timeInView : 1
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

                this.increaseAtomTimeInView(id, delta);
                analytics.send('Atom Engagement', 'Time', id, delta, $(el).attr('data-weight'), $(el).attr('data-type'), $(el).parent().hasClass('group--is-reintroduced'));

                delete analyticsTimers[id];
            }
        }.bind(this));
    },

    increaseAtomTimeInView: function(id, time) {
        var seen = this.get('seen');

        if (seen[id]) {
            seen[id].timeInView = seen[id].timeInView + time;
        }

        this.set('seen', seen);
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