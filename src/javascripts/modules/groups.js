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

        var atoms = 0;

        $(el).children('.atom').each(function(i, el) {
            if (i !== 0) {
                $(el).attr('data-shrink', i);
            } else {
                $(el).attr('data-shrink', '');
            }

            atoms++;
        });

        $(el).children('.atom').first().attr('style', 'margin-bottom: -24px');
    },

    expandGroup: function(el) {
        var $group = $(el).parent();
        var $firstAtom = $group.find('.atom').first();

        $group.removeClass('group--collapsed');
        $group.addClass('group--expanded');

        analytics.send('Atom engagment', 'Expand', $firstAtom.attr('data-id'), '', $firstAtom.attr('data-weight'), $firstAtom.attr('data-type'));

        $group.children('.atom').first().attr('style', '');

    }
}