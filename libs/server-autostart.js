var cfg = require('config');
var ac = require('./server-handler');

exports.start = function() {
    var autostarts = cfg.ACM.autostart;
    for (var p in autostarts) {
        var rc = autostarts[p] ? ac.start(p) : false;
    }
};