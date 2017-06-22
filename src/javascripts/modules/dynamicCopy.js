var $ = require('../vendor/jquery.js');
var timeTools = require('../helpers/timeTools');

module.exports = {
    init: function() {
        this.dynamicDates();
        this.dynamicCharacters();
    },

    dynamicDates: function() {
        $('.atom__copy').each(function(i, el) {
            $(el).html($(el).text().replace(/time.[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/g, this.returnDynamicTime));
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

    dynamicCharacters: function() {
        var characters = this.fetchCharacters();

        for (var i in characters) {
            this.replaceCharacters(characters[i], i);
        }
    },

    fetchCharacters: function() {
        var json = (function () {
            var json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': 'characters.json',
                'dataType': 'json',
                'success': function (data) {
                    json = data;
                }
            });
            return json;
        })();

        return json;
    },

    replaceCharacters: function(character, i) {
        var html = '<span class=\'character character--' + i + '\'><span class=\'character__short\'>' + character.shortName + '</span><span class=\'character__long\'>' + character.longName + '</span></span>';
        var regex = new RegExp('character.' + character.id , 'g')

        $('.atom__copy').each(function(i, el) {
            $(el).html($(el).text().replace(/character.munoz/g, html));
        });

        $('.character--' + i).each(function(i, el) {
            if (i === 0) {
                $(el).addClass('character--long');
            } else {
                $(el).addClass('character--short');
            }
        });
    }
}