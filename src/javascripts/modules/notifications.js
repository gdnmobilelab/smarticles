var $ = require('../vendor/jquery.js');
var load = require('scriptloader');

var OneSignal;

module.exports = {
    init: function() {
        this.loadOneSignal();
    },

    loadOneSignal: function() {
        load('https://cdn.onesignal.com/sdks/OneSignalSDK.js', function() {
            this.createClient();
        }.bind(this));
    },

    createClient: function() {
        OneSignal = window.OneSignal || [];

        OneSignal.push(["init", {
            appId: "849ca530-6a6d-4058-9d5e-4802b20c0654",
            allowLocalhostAsSecureOrigin: true,
            autoRegister: true,
            notifyButton: {
                enable: false
            }
        }]);
    }
}