var $ = require('../vendor/jquery.js');
var analytics = require('../modules/analytics');

var players = {};

module.exports = {
    init: function() {
        this.populatePlayers();
        this.loadYouTubeAPI();
    },

    populatePlayers: function() {
        $('.atom-video__video iframe').each(function(i, el) {
            $(el).attr('id', 'ytplayer' + i);
            players[i] = $(el).attr('id');
        });
    },

    loadYouTubeAPI: function() {
        var tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

        $('body').append(tag);
    },

    onLoad: function() {
        for (var i in players) {
            players[i] = new YT.Player(players[i], {
                events: {
                    'onReady': this.bindPlayer,
                    'onStateChange': this.onPlayerStateChange
                }
            });
        }
    },

    bindPlayer: function(event) {
        $(event.target.a).parent().addClass('is-ready');

        $(event.target.a).parent().find('.atom-video__thumbnail').click(function() {
            $(event.target.a).parent().removeClass('is-ready').addClass('is-playing');
            event.target.playVideo();
        }.bind(event));
    },

    onPlayerStateChange: function(event) {
        var state = event.data;
        var $atom = $(event.target.a).parent().parent();

        if (state === 1) {
            analytics.send('Video', 'Play', event.target.j.videoData.title, 1, $atom.attr('data-weight'), 'video');
        }
        if (state === 2) {
            analytics.send('Video', 'Pause', event.target.j.videoData.title, 1, $atom.attr('data-weight'), 'video');
        }
    }
}

global.onYouTubeIframeAPIReady = function() {
    module.exports.onLoad();
}