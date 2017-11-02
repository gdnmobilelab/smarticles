var $ = require('../vendor/jquery.js');
var storage = require('../modules/storage.js');
var handlebars = require('handlebars');
var request = require('sync-request');

var templateHtml = require('../../templates/atoms.html');
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
        group: require('../../templates/includes/group.html')
    }
}

var callback;

module.exports = {
    init: function(addedCallback) {
        callback = addedCallback;

        this.fetchData();

    },

    fetchData: function() {
        var isDebug = $('body').attr('data-is-debug');
        var path = isDebug == undefined ? 'https://bob.gdnmobilelab.com' : 'http://localhost:3000';
        var res = request('GET', path + '/?id=' + $('body').attr('data-id') + '&seen=' + storage.get('seen').toString() + '&visit=' + storage.get('visit'));

        $('.banner').attr('style', 'display: block;');
        $('.banner__copy').text('Seen:' + storage.get('seen').toString() + ' | Visit:' + storage.get('visit'))

        this.createHTML(JSON.parse(res.body.toString()));
    },

    createHTML: function(data) {
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

        var template = handlebars.compile(templateHtml);
        $('.atoms-container').html(template(data));

        callback();
    }
}