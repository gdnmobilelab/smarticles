var $ = require('../vendor/jquery.js');

module.exports = {
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
    },

    getWeeks: function(delta) {
        var weeks = Math.floor(delta / (60 * 60 * 24 * 7));
        return weeks + ' week' + (weeks > 1 ? 's' : '');
    }
}