var injectHtml = require('./modules/injectHtml');
var banner = require('./modules/banner');
var lastUpdated = require('./modules/lastUpdated');
var groups = require('./modules/groups');
var dynamicCopy = require('./modules/dynamicCopy');
var notifications = require('./modules/notifications');
var storage = require('./modules/storage');

injectHtml.init(function() {
    banner.init();
    lastUpdated.init();
    groups.init();
    dynamicCopy.init();
    notifications.init();
    storage.init();
});
