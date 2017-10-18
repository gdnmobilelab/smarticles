var banner = require('./modules/banner');
var lastUpdated = require('./modules/lastUpdated');
var filter = require('./modules/filter');
var groups = require('./modules/groups');
var dynamicCopy = require('./modules/dynamicCopy');
var notifications = require('./modules/notifications');

banner.init();
lastUpdated.init();
filter.init();
groups.init();
dynamicCopy.init();
notifications.init();
