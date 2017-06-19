var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        this.convertTimeStamps();
    },

    convertTimeStamps: function() {
        $('.atom').each(function(i, el) {
            var date = $(el).attr('data-timeStamp');
            $(el).find('.atom__timestamp').text(this.timeToRelative(date));
        }.bind(this));
    },

    timeToRelative: function(timeStamp) {
        var then = new Date(timeStamp),
            delta = parseInt((new Date() - then) / 1000, 10);

        if (delta < 0) {
            return 'In the future?!?!'
        } else if (delta < 55) {
            return delta + ' second' + (delta > 1 ? 's': '') + ' ago';

        } else if (delta < (55 * 60)) {
            minutes = Math.round(delta / 60, 10);
            return minutes + ' minute' + (minutes > 1 ? 's': '') + ' ago';

        } else if (this.isToday(then)) {
            hours = Math.round(delta / 3600);
            return hours + ' hour' + (hours > 1 ? 's': '') + ' ago';

        } else if (this.isYesterday(then)) {
            return 'Yesterday'

        } else if (delta < 7 * 24 * 60 * 60) { // less than five days
            return 'On ' + this.getDay(then);

        } else {
            return this.getDay(then) + ' ' + then.getDate() + ' ' + this.getMonth(then) + ' ' + then.getFullYear();
        }
    },

    isToday: function(date) {
        var now = new Date();
        return date.toDateString() === now.toDateString() ? true : false;
    },

    isYesterday: function(date) {
        var yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

        return date.toDateString() === yesterday.toDateString() ? true : false;
    },

    getDay: function(then) {
        var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return weekDays[then.getDay()];
    },

    getMonth: function(then) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[then.getMonth()];
    }
}