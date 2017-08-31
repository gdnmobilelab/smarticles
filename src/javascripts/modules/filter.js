var $ = require('../vendor/jquery.js');
var storage = require('../modules/storage.js');

var lastVisitedDate;

module.exports = {
    init: function() {
        if ($('body').attr('data-filtering') === 'TRUE') {
            lastVisitedDate = storage.get('lastVisitedDate');

            if (lastVisitedDate === null) {
                this.showAllAtoms();
            } else {
                this.filterAtoms();
            }
        } else {
            this.showAllAtoms();
        }
    },

    showAllAtoms: function() {
        $('.atom').addClass('atom--visible');
        storage.set('lastVisitedDate', Date.now());
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

        storage.set('lastVisitedDate', Date.now());
    }
}