var $ = require('../vendor/jquery.js');
module.exports = {
    init: function() {
        this.enhanceTweets();
    },

    enhanceTweets: function() {
        var tweets = $('.atom-tweet__tweet').each(function(i, tweet) {
            var id = $(tweet).data('url');

            $.ajax({
                url: 'https://publish.twitter.com/oembed?url=' + id,
                dataType: 'jsonp',
                success: function(data) {
                   $(tweet).html(data.html);
                }
            });
        });
    }
}