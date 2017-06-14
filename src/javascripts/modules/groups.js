var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        this.collapseGroups();
        this.bindings();
    },

    collapseGroups: function() {
        $('.group--collapsed').each(function(i, el) {
            this.collapseGroup(el);
        }.bind(this));
    },

    collapseGroup: function(el) {
        $(el).addClass('group--collapsed');
        $(el).removeClass('group--expanded');

        $(el).find('.atom').each(function(i, el) {
            if (i !== 0) {
                $(el).css({
                    'margin-top': '-' + ($(el).height() + 18) + 'px',
                    'z-index': '-' + (i + 1)
                });
            }
        });
    },

    bindings: function() {
        $('.group__expand-button').click(function(e) {
            console.log('click');
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
        });
    }
}