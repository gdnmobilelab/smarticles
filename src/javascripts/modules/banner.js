var $ = require('../vendor/jquery.js');

module.exports = {
    init: function() {
        this.checkForNotifications();
    },

    checkForNotifications: function() {
        if ('Notification' in self && 'serviceWorker' in navigator) {
            // Yey for notifications
        } else {
            $('.banner').show();
        }
    }
}