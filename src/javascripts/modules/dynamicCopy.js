var $ = require('../vendor/jquery.js');
var timeTools = require('../helpers/timeTools');

module.exports = {
    init: function() {
        this.dynamicDates();
        this.dynamicCharacters();
    },

    dynamicDates: function() {
        $('.atom__copy').each(function(i, el) {
            $(el).html($(el).html().replace(/time.[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/g, this.returnDynamicTime));
        }.bind(this));
    },

    returnDynamicTime: function(date) {
        date = date.replace('time.', '').split('/');
        date = new Date(date[1] + '/' + date[0] + '/' + date[2]);

        var delta = parseInt((new Date() - date) / 1000, 10);

        if (timeTools.isToday(date)) {
            return 'Today'

        } else if (timeTools.isYesterday(date)) {
            return 'Yesterday'

        } else if (delta < 7 * 24 * 60 * 60) { // less than five days
            return 'On ' + timeTools.getDay(date);

        } else if (delta < 21 * 24 * 60 * 60) {
            return timeTools.getWeeks(delta) + ' ago';

        } else {
            return 'On ' + date.getDate() + ' ' + timeTools.getMonth(date);
        }

        return date;
    },

    calculateText: function(el) {
        return $(el).attr('data-date');
    },

    dynamicCharacters: function(character, i) {
        // TODO: Write this a little smarter than just looping 10 times...
        for (var i = 0; 10 > i; i++) {
            $('.character--' + i).each(function(i, el) {
                if (i === 0) {
                    $(el).addClass('character--long');
                } else {
                    $(el).addClass('character--short');
                }
            });
        }
    }
}