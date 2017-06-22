var $ = require('../vendor/jquery.js');
var timeTools = require('../helpers/timeTools.js');

module.exports = {
    init: function() {
        this.setLastUpdated();
    },

    setLastUpdated: function() {
        var timeStamp = new Date($('.header__last-updated').attr('data-time-stamp'));
        $('.header__last-updated').text(this.returnRelativeTimeStamp(timeStamp));
    },

    returnRelativeTimeStamp: function(timestamp) {
        var now = new Date(),
            then = new Date(timestamp),
            delta = parseInt((now.getTime() - timestamp) / 1000, 10);

        if (delta < 0) {
            return false;

        } else if (delta < 55) {
            return delta + ' second' + (delta > 1 ? 's': '') + ' ago';

        } else if (delta < (55 * 60)) {
            minutes = Math.round(delta / 60, 10);
            return minutes + ' minute' + (minutes > 1 ? 's': '') + ' ago';

        } else if (timeTools.isToday(then)) {
            hours = Math.round(delta / 3600);
            return hours + ' hour' + (hours > 1 ? 's': '') + ' ago';

        } else if (timeTools.isYesterday(then)) {
            return 'Yesterday'

        } else if (delta < 5 * 24 * 60 * 60) { // less than five days
            return 'On ' + timeTools.getDay(then);

        } else {
            return timeTools.getDay(then) + ' ' + then.getDate() + ' ' + timeTools.getMonth(then) + ' ' + then.getFullYear();
        }
    }
}