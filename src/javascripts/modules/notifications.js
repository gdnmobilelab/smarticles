var $ = require('../vendor/jquery.js');
var load = require('scriptloader');

var OneSignal, pageId;

module.exports = {
    init: function() {
        this.loadOneSignal();
        this.setValues();
    },

    loadOneSignal: function() {
        load('https://cdn.onesignal.com/sdks/OneSignalSDK.js', function() {
            this.createClient();
        }.bind(this));
    },

    setValues: function() {
        pageId = $('body').attr('data-id');
    },

    createClient: function() {
        OneSignal = window.OneSignal || [];

        OneSignal.push(["init", {
            appId: "849ca530-6a6d-4058-9d5e-4802b20c0654",
            allowLocalhostAsSecureOrigin: true,
            autoRegister: false,
            notifyButton: {
                enable: false
            }
        }]);

        var isPushSupported = OneSignal.isPushNotificationsSupported();

        if (isPushSupported) {
            this.checkIfUserIsSubscribed();
        }
    },

    checkIfUserIsSubscribed: function() {
        OneSignal.isPushNotificationsEnabled(function(isEnabled) {
            if (isEnabled) {
                OneSignal.getTags().then(function(tags) {
                    if (tags[pageId]) {
                        this.initButton('is-subscribed');
                    } else {
                        this.initButton('not-subscribed');
                    }
                }.bind(this));
            } else {
                this.initButton('not-subscribed');
            }
        }.bind(this));
    },

    initButton: function(state) {
        $('.header__notifications').addClass('is-supported');
        $('.header__notifications').addClass(state);
        this.bindings();
    },

    bindings: function() {
        $('.header__notifications').click(function() {
            this.toggleSubscribe();
        }.bind(this));
    },

    toggleSubscribe: function() {
        if ($('.header__notifications').hasClass('not-subscribed')) {
            OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                if (!isEnabled) {
                    OneSignal.registerForPushNotifications();
                }
                OneSignal.sendTag(pageId, 'subscribed');
                $('.header__notifications').removeClass('not-subscribed').addClass('is-subscribed');
            });
        } else {
            OneSignal.deleteTag(pageId);
            $('.header__notifications').removeClass('is-subscribed').addClass('not-subscribed');
        }
    }
}