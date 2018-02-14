var $ = require('../vendor/jquery.js');
var storage = require('../modules/storage.js');
var analytics = require('../modules/analytics.js');

var handlebars = require('handlebars');

var callback, params = {};

module.exports = {
    init: function(addedCallback) {
        callback = addedCallback;

        this.getParams();
        this.fetchData();
    },

    getParams: function() {
        var entries = new URLSearchParams(window.location.search).entries();

        for (pair of entries) {
            params[pair[0]] = pair[1];
        }

        if (params.debug == '') {
            params.debug = true;
        }

        if (!params.id) {
            params.id = $('body').attr('data-id');
        }

        if (!params.seen) {
            params.seen = storage.get('seen');
        }

        if (!params.visit) {
            var visit = storage.get('visit');
                visit = visit ? visit + 1 : 1;

            storage.set('visit', visit);
            analytics.send('Visit', 'Visit', visit);
            params.visit = visit;
        }

        if (!params.lastVisited) {
            var lastVisited = storage.get('lastVisited');
            params.lastVisited = lastVisited ? lastVisited : '';
        }

        if (!params.onboarding) {
            var onboarding = storage.get('onboarding');
            params.onboarding = onboarding ? false : true;
        }

        if (!params.api) {
            params.api = $('body').attr('data-use-local') == undefined ? 'https://bob.gdnmobilelab.com' : 'http://localhost:3000';
        }
    },

    fetchData: function() {
        if (params.debug) {
            $('.banner').attr('style', 'display: block;');
            $('.banner__copy').text('You\'re in Debug mode, this shows you all atoms directly from the spreadsheet. This may take a second or two...');
        }

        analytics.send('API Request', 'Sent', params.apiQuery);

        console.log(params);

        $.post(params.api, params).done(function(data) {
            console.log(data);
            this.createHTML(data);
        }.bind(this));
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
                link: require('../../templates/atoms/link.html')
            },
            includes: {
                group: require('../../templates/includes/group.html'),
                notifications: require('../../templates/includes/notifications.html')
            }
        }

        handlebars.registerHelper("switch", function(value, options) {
            this._switch_value_ = value;
            var html = options.fn(this);
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

        if ($('.atoms--main').children().length <= 0) {
            $('html').addClass('is-empty');
        }

        $('body').addClass('has-loaded');

        callback();
    }
}