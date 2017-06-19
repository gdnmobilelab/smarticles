var $ = require('../vendor/jquery.js');

var lastVisitedDate;

module.exports = {
    init: function() {
        // lastVisitedDate = this.getLastVisitedDate();
        lastVisitedDate = new Date('Jun 12 2017 17:00:00 GMT-0400 (EDT)');

        if (lastVisitedDate === null) {
            this.showAllAtoms();
        } else {
            this.filterAtoms();
        }
    },

    getLastVisitedDate: function() {
        return localStorage.getItem('lastVisitedDate');
    },

    setLastVisitedDate: function() {
        localStorage.setItem('lastVisitedDate', Date.now());
    },

    showAllAtoms: function() {
        $('.atom').addClass('atom--visible');
        this.setLastVisitedDate();
    },

    filterAtoms: function() {
        $('.group').each(function(i, el) {
            var visibleInGroup = 0;

            $(el).find('.atom').each(function(i, el) {
                var atomDate = new Date($(el).attr('data-timestamp'));

                if (lastVisitedDate < atomDate) {
                    $(el).addClass('atom--visible');
                    visibleInGroup++;
                }
            });

            if (visibleInGroup === 0) {
                $(el).css({
                    'display': 'none'
                });
            }
        });

        this.setLastVisitedDate();
    }
}