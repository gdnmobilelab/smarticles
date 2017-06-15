var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        this.convertTimeStamps();
    },

    convertTimeStamps: function() {
        $('.atom').each(function(i, el) {
            var date = $(el).attr('data-timeStamp');
            var now = $(el).parent().parent().attr('data-date');
            $(el).find('.atom__timestamp').text(this.timeToRelative(date, now));
        }.bind(this));
    },

    timeToRelative: function(timeStamp, today) {
        today = today.split('/');

        var now = new Date(today[1] + '/' + today[0] + '/' + today[2] + ' 20:59'),
            then = new Date(timeStamp),
            delta = parseInt((now - then) / 1000, 10);

        if (delta < 0) {
            return 'In the future?!?!'
        } else if (delta < 55) {
            return delta + ' second' + (delta > 1 ? 's': '') + ' ago';

        } else if (delta < (55 * 60)) {
            minutes = Math.round(delta / 60, 10);
            return minutes + ' minute' + (minutes > 1 ? 's': '') + ' ago';

        } else if (this.isToday(then, now)) {
            hours = Math.round(delta / 3600);
            return hours + ' hour' + (hours > 1 ? 's': '') + ' ago';

        } else if (this.isYesterday(then, now)) {
            return 'Yesterday'

        } else if (delta < 7 * 24 * 60 * 60) { // less than five days
            return 'On ' + this.getDay(then);

        } else {
            return this.getDay(then) + ' ' + then.getDate() + ' ' + this.getMonth(then) + ' ' + then.getFullYear();
        }
    },

    isToday: function(date, now) {
        return date.toDateString() === now.toDateString() ? true : false;
    },

    isYesterday: function(date, now) {

        var yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);

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