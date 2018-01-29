var $ = require('../vendor/jquery.js');
var analytics = require('../modules/analytics');
var storage = require('../modules/storage');

var scrollTop = 0, trigger = 0, hasTriggered = false, canTrigger = false;

module.exports = {
    init: function() {
        canTrigger = $('.group--onboarding').length;

        if (canTrigger) {
            this.bindings();
            this.setValues();
            this.updateValues();
            storage.set('onboarding', true);
        }
    },

    bindings: function() {
        $(window).scroll(function() {
            if (canTrigger) {
                this.updateValues();
                this.checkForPosition();
            }
        }.bind(this));

        $(window).resize(function() {
            this.setValues();
        }.bind(this));

        $('.onboarding__dismiss').click(function() {
            this.closeOnboarding();
        }.bind(this));
    },

    setValues: function() {
        if ($('.atom').length > 3) {
            trigger = $('.atom:eq(4)').offset().top;
        }
        this.updateValues();
    },

    updateValues: function() {
        scrollTop = $(window).scrollTop(); 
    },

    checkForPosition: function() {
        if (scrollTop > trigger && hasTriggered == false) {
            this.showOnboarding();
        }
    },

    showOnboarding: function() {
        hasTriggered = true;
        $('.onboarding').addClass('show');
    },

    closeOnboarding: function() {
        $('.onboarding').removeClass('show');
    },

    disableTriggerability: function() {
        canTrigger = false;
    }
}