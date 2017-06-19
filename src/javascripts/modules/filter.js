var $ = require('../vendor/jquery.js');

var lastVisitedDate;

module.exports = {
    init: function() {
        lastVisitedDate = this.getLastVisitedDate();
        this.filterAtoms();
    },

    getLastVisitedDate: function() {
        return localStorage.getItem('lastVisitedDate');
    },

    setLastVisitedDate: function() {
        var currentDate = Date.now();
        localStorage.setItem('lastVisitedDate', currentDate);
    },

    filterAtoms: function() {
        
    }
}