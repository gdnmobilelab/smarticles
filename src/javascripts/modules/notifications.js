var $ = require('../vendor/jquery.js');
var load = require('scriptloader');
var analytics = require('../modules/analytics.js');
var onboarding = require('../modules/onboarding.js');

var OneSignal, pageId;

module.exports = {
    init: function() {
        this.loadOneSignal();
        this.setValues();
        this.removeNotificationUrl();
    },

    loadOneSignal: function() {
        load('https://cdn.onesignal.com/sdks/OneSignalSDK.js', function() {
            this.createClient();
        }.bind(this));
    },

    setValues: function() {
        pageId = $('body').attr('data-slug');
    },

    createClient: function() {
        OneSignal = window.OneSignal || [];

        OneSignal.push(["init", {
            appId: "849ca530-6a6d-4058-9d5e-4802b20c0654",
            allowLocalhostAsSecureOrigin: true,
            autoRegister: false,
            persistNotification: true,
            notifyButton: {
                enable: false
            }
        }]);

        var isPushSupported = OneSignal.isPushNotificationsSupported();

        if (isPushSupported) {
            this.checkIfUserIsSubscribed();
        } else {
            $('.notifications').addClass('not-supported');
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
        $('.notifications').removeClass('is-loading');
        $('.notifications').addClass('is-supported');
        $('.notifications').addClass(state);
        if (state === 'not-subscribed') {
            onboarding.init();
        }
        this.bindings();
    },

    bindings: function() {
        $('.notifications').click(function() {
            this.toggleSubscribe();
        }.bind(this));
    },

    toggleSubscribe: function() {
        if ($('.notifications').hasClass('not-subscribed')) {
            OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                if (!isEnabled) {
                    OneSignal.registerForPushNotifications();
                }
                OneSignal.sendTag(pageId, 'subscribed');
                $('.notifications').removeClass('not-subscribed').addClass('is-subscribed');

                analytics.send('Notification', 'Subscribe', 'Subscribe');
            });
        } else {
            OneSignal.deleteTag(pageId);
            $('.notifications').removeClass('is-subscribed').addClass('not-subscribed');
            analytics.send('Notification', 'Unsubscribe', 'Unsubscribe', '');
        }
    },

    removeNotificationUrl: function() {
        setTimeout(function() {
            if (window.location.search.indexOf('utm_source') > -1) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }, 1000);
    }
}