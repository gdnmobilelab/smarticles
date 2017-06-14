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

        $(el).find('.atom').each(function(i, el) {
            if (i !== 0) {
                if ($(el).hasClass('atom--hidden') == true || $(el).prev().hasClass('atom--hidden') == true) {
                    $(el).css({
                        'margin-top': ''
                    });
                } else {
                    $(el).css({
                        'margin-top': '-' + ($(el).height() + 18) + 'px',
                        'z-index': '-' + (i + 1)
                    });
                }
            } else {
                console.log('skipping an atom');
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
        });
    }
}