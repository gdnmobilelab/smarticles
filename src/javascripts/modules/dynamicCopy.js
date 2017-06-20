var $ = require('../vendor/jquery.js');
var timeStamps = require('../modules/timeStamps');

module.exports = {
    init: function() {
        this.dynamicDates();
    },

    dynamicDates: function() {
        $('.atom__copy').each(function(i, el) {
            $(el).html($(el).text().replace(/time.[^abc]{9}/g, this.returnDynamicTime));
            $(el).html($(el).text().replace(/time.[^abc]{10}/g, this.returnDynamicTime));
        }.bind(this));
    },

    returnDynamicTime: function(date) {
        date = date.replace('time.', '').split('/');
        date = new Date(date[1] + '/' + date[0] + '/' + date[2]);

        var delta = parseInt((new Date() - date) / 1000, 10);

        if (timeStamps.isToday(date)) {
            return 'Today'
        } else if (timeStamps.isYesterday(date)) {
            return 'Yesterday'
        } else if (delta < 7 * 24 * 60 * 60) { // less than five days
            return 'On ' + timeStamps.getDay(date);
        } else {
            return 'On ' + date.getDate() + ' ' + timeStamps.getMonth(date);
        }

        return date;
    },

    calculateText: function(el) {
        return $(el).attr('data-date');
    }
}