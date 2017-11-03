var $ = require('../vendor/jquery.js');
var storage = require('../modules/storage.js');

var handlebars = require('handlebars');

var callback;

module.exports = {
    init: function(addedCallback) {
        callback = addedCallback;

        this.fetchData();
    },

    fetchData: function() {
        var isDebug = $('body').attr('data-is-debug');
        var apiPath = isDebug == undefined ? 'https://bob.gdnmobilelab.com' : 'http://localhost:3000';
        var path = apiPath + '/?id=' + $('body').attr('data-id') + '&seen=' + this.calculateSeenAtomsToSend() + '&visit=' + (storage.get('visit') ? storage.get('visit') : 1);

        $('.banner').attr('style', 'display: block;');
        $('.banner__copy').text('Seen:' + this.calculateSeenAtomsToSend() + ' | Visit:' + (storage.get('visit') ? storage.get('visit') : 1));

        $.get(path, function(data) {
            this.createHTML(data);
        }.bind(this));
    },

    calculateSeenAtomsToSend: function() {
        var seen = storage.get('seen');
        var now = new Date();
        var sentSeen = [];

        for (var i in seen) {
            if ((now - new Date(seen[i].time)) > (10 * 60 * 1000)) {
                sentSeen.push(i);
            }
        }

        return sentSeen.toString();
    },

    createHTML: function(data) {
        var headerHtml = require('../../templates/header.html');
        var atomsHtml = require('../../templates/atoms.html');
        var partials = {
            atoms: {
                bio: require('../../templates/atoms/bio.html'),
                graphic: require('../../templates/atoms/graphic.html'),
                image: require('../../templates/atoms/image.html'),
                quote: require('../../templates/atoms/quote.html'),
                text: require('../../templates/atoms/text.html'),
                tweet: require('../../templates/atoms/tweet.html'),
                video: require('../../templates/atoms/video.html'),
            },
            includes: {
                group: require('../../templates/includes/group.html'),
                notifications: require('../../templates/includes/notifications.html')
            }
        }

        handlebars.registerHelper("switch", function(value, options) {
            this._switch_value_ = value;
            var html = options.fn(this); // Process the body of the switch block
            delete this._switch_value_;
            return html;
        });

        handlebars.registerHelper("case", function(value, options) {
            if (value == this._switch_value_) {
                return options.fn(this);
            }
        });

        for (var i in partials) {
            for (var template in partials[i]) {
                handlebars.registerPartial(i + '/' + template, partials[i][template])
            }
        }

        var atomTemplate = handlebars.compile(atomsHtml);
        $('.atoms-container').html(atomTemplate(data));

        var headerTemplate = handlebars.compile(headerHtml);
        $('.header-container').html(headerTemplate(data));

        if ($('.atoms--main').is(':empty')) {
            $('html').addClass('is-empty');
        }

        callback();
    }
}