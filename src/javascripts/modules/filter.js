var groups = require('../modules/groups.js');
var $ = require('../vendor/jquery.js');

var atoms, dates;

module.exports = {
    init: function() {
        atoms = this.getAtoms();
        this.setSliders(this.getDates());
        this.filterAtoms();
        this.bindings();
    },

    getAtoms: function() {
        var times = [];

        $('.atoms--visible .atom').each(function(i, el) {
            times.push({
                timeStamp: $(el).attr('data-timestamp')
            });
        });

        return times;
    },

    getDates: function() {
        dates = [];

        $('.atoms').each(function(i, el) {
            dates.push(this.usDate($(el).attr('data-date')));
        }.bind(this));

        return dates;
    },

    setSliders: function() {
        $('.devbar__slider').attr('max', dates.length - 1);
        $('.devbar__slider--last').attr('val', dates.length - 1);

        this.setSliderLabel($('.devbar__slider--start'), $('.devbar__slider--start').val());
        this.setSliderLabel($('.devbar__slider--end'), $('.devbar__slider--end').val());
    },

    bindings: function() {
        $('.devbar__slider').change(function(el) {
            this.sliderChange(el.currentTarget);
        }.bind(this))
    },

    sliderChange: function(el) {;
        this.setSliderLabel(el, $(el).val());
        this.filterAtoms();
    },

    setSliderLabel: function(el, val) {
        $(el).prev().find('.devbar__value').text(new Date(dates[val]).toDateString());
    },

    usDate: function(date) {
        date = date.split('/');
        return new Date(date[1] + '/' + date[0] + '/' + date[2]);
    },

    filterAtoms: function() {
        var start = new Date(dates[$('.devbar__slider--start').val()]);
        var end = new Date(dates[$('.devbar__slider--end').val()]);

        // Show correct Day
        $('.atoms--visible').removeClass('atoms--visible');
        $('.atoms').each(function(i, el) {
            if (end.getTime() == this.usDate($(el).attr('data-date')).getTime()) {
                $(el).addClass('atoms--visible');
            }
        }.bind(this));

        // Show correct Atoms
        $('.atom--visible').removeClass('atom--visible');
        $('.atoms--visible .atom').each(function(index, el) {
            var date = new Date($(el).attr('data-timestamp'));

            if (start < date) {
                $(el).addClass('atom--visible');
            }
        });

        groups.collapseGroups();

        // Hide hidden groups
        $('.group--hidden').removeClass('group--hidden');
        $('.atoms--visible .group').each(function(index, el) {
            var hiddenAtoms = $(el).find('.atom--visible').length;

            if (hiddenAtoms === 0) {
                $(el).addClass('group--hidden');
            }
        });
    }
}