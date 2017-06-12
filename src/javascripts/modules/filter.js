var $ = require('../vendor/jquery.js');

var atoms, dates;

module.exports = {
    init: function() {
        atoms = this.getAtoms();
        this.setSliders(this.getDates());
        this.bindings();
    },

    getAtoms: function() {
        var times = [];

        $('.atom').each(function(index, el) {
            times.push({
                timeStamp: $(el).attr('data-timestamp')
            });
        });

        return times;
    },

    getDates: function() {
        dates = new Array();

        $.each(atoms, function(i, val) {
            var date = new Date(val.timeStamp).setHours(0, 0, 0, 0);

            if (dates.indexOf(date) === -1) {
                dates.push(date);
            }
        });

        dates.reverse();

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
    },

    setSliderLabel: function(el, val) {
        $(el).prev().find('.devbar__value').text(new Date(dates[val]).toDateString());
    }
}