var lastUpdated = require('./modules/lastUpdated');
var filter = require('./modules/filter');
var groups = require('./modules/groups');
var dynamicCopy = require('./modules/dynamicCopy');
var notifications = require('./modules/notifications');

lastUpdated.init();
filter.init();
groups.init();
dynamicCopy.init();
notifications.init();
