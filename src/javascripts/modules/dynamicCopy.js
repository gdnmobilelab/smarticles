var $ = require('../vendor/jquery.js');
var timeTools = require('../helpers/timeTools');

var datePattern = /time.[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/g;

module.exports = {
    init: function() {
        this.dynamicDates();
        this.dynamicCharacters();
    },

    dynamicDates: function() {
        $('.atom__copy').each(function(i, el) {
            while((match = datePattern.exec($(el).html()))) {
                this.populateDynamicDate(el, match.index, datePattern.lastIndex);
            }
        }.bind(this));
    },

    populateDynamicDate: function(el, start, end) {
        var precedingChars = $(el).html().substring(start - 2, start);
        var match = $(el).html().substring(start, end);
        var html = $(el).html();

        if (precedingChars.indexOf('.') !== -1) {
            $(el).html(html.substring(0, start) + this.returnDynamicTime(match, true) + html.substring(end, html.length));
        } else {
            $(el).html(html.substring(0, start) + this.returnDynamicTime(match, false) + html.substring(end, html.length));
        }
    },

    returnDynamicTime: function(date, isNewSentence) {
        date = date.replace('time.', '').split('/');
        date = new Date(date[1] + '/' + date[0] + '/' + date[2]);

        var delta = parseInt((new Date() - date) / 1000, 10);

        if (timeTools.isToday(date)) {
            return 'Today'

        } else if (timeTools.isYesterday(date)) {
            return 'Yesterday'

        } else if (delta < 7 * 24 * 60 * 60) { // less than five days
            return (isNewSentence ? 'O' : 'o') + 'n ' + timeTools.getDay(date);

        } else if (delta < 21 * 24 * 60 * 60) {
            return timeTools.getWeeks(delta) + ' ago';

        } else {
            return (isNewSentence ? 'O' : 'o') + 'n ' + date.getDate() + ' ' + timeTools.getMonth(date);
        }

        return date;
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