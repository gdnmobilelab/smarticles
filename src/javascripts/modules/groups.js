var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        this.collapseGroups();
        this.bindings();
    },

    collapseGroups: function() {
        $('.atoms--visible .group--collapsed').each(function(i, el) {
            this.collapseGroup(el);
        }.bind(this));
    },

    collapseGroup: function(el) {
        $(el).addClass('group--collapsed');
        $(el).removeClass('group--expanded');

        $(el).children('.atom--visible').each(function(i, el) {
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

    bindings: function() {
        $('.group__expand-button').click(function(e) {
            this.expandGroup(e.currentTarget);
        }.bind(this));
    },

    expandGroup: function(el) {
        var $group = $(el).parent();

        $group.removeClass('group--collapsed');
        $group.addClass('group--expanded');

        $group.find('.atom').each(function(i, el) {
            $(el).css({
                'margin-top': ''
            });
            $(el).attr('data-shrink', '');
        });
    }
}