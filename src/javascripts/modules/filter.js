var $ = require('../vendor/jquery.js');

var lastVisitedDate;

module.exports = {
    init: function() {
        // lastVisitedDate = this.getLastVisitedDate();
        lastVisitedDate = new Date('Apr 9 2017 17:00:00 GMT-0400 (EDT)');

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
        var hasVisibleGroups = false;

        $('.group').each(function(i, el) {
            var hasVisibleAtoms = false;

            $(el).find('.atom').each(function(i, el) {
                var atomDate = new Date($(el).attr('data-timestamp'));

                if (lastVisitedDate < atomDate) {
                    $(el).addClass('atom--visible');
                    hasVisibleAtoms = true;
                }
            });

            if (!hasVisibleAtoms) {
                $(el).css({
                    'display': 'none'
                });
            } else {
                hasVisibleGroups = true;
            }
        });

        if (!hasVisibleGroups) {
            $('body').addClass('has-no-atoms');
        }

        this.setLastVisitedDate();
    }
}