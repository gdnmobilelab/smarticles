var $ = require('../vendor/jquery.js');
var analytics = require('../modules/analytics');

module.exports = {
    init: function() {
        this.collapseGroups();
        this.bindings();
    },

    bindings: function() {
        $('.group__expand-button').click(function(e) {
            this.expandGroup(e.currentTarget);
        }.bind(this));
    },

    collapseGroups: function() {
        $('.group--collapsed').each(function(i, el) {
            this.collapseGroup(el);
        }.bind(this));
    },

    collapseGroup: function(el) {
        $(el).addClass('group--collapsed');
        $(el).removeClass('group--expanded');

        $(el).children('.atom').each(function(i, el) {
            if (i !== 0) {
                $(el).css({
                    'margin-top': '-' + ($(el).height() + 4) + 'px',
                    'z-index': '-' + i
                });
                $(el).attr('data-shrink', i);
            } else {
                $(el).css({
                    'margin-top': '',
                    'z-index': ''
                });
                $(el).attr('data-shrink', '');
            }
        });
    },

    expandGroup: function(el) {
        var $group = $(el).parent();
        var $firstAtom = $group.find('.atom').first();

        $group.removeClass('group--collapsed');
        $group.addClass('group--expanded');

        analytics.send('Atom engagment', 'Expand', $firstAtom.attr('data-id'), '', $firstAtom.attr('data-weight'), $firstAtom.attr('data-type'));

        $group.find('.atom').each(function(i, el) {
            $(el).css({
                'margin-top': ''
            });
            $(el).attr('data-shrink', '');
        });
    }
}