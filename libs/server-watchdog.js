var cfg = require('config');
var ac = require('./server-handler');
var db = require('./db');

var checkServers = function () {
    for (var presetName in ac.servers) {
        if(ac.status(ac.servers[presetName]) < 1) {
            console.error('Preset', presetName, 'found dead');
            db.addHistory({user: 'watchdog', msg:'Preset ' + presetName + ' found dead'});
            delete ac.servers[presetName];
            autoRestart(presetName);
        }
    }
    setTimeout(checkServers, cfg.ACM.watchdog.interval);
};

var autoRestart = function (presetName) {
    var restart = cfg.ACM.autostart[presetName];
    if (restart) {
        db.addHistory({user: 'watchdog', msg:'Autorestart ' + presetName + ''});
        console.log('Restarting', presetName);
        ac.start(presetName);
    }
};

var autoStart = function () {
    var autostarts = cfg.ACM.autostart;
    for (var presetName in autostarts) {
        db.addHistory({user: 'watchdog', msg:'Autostart ' + presetName + ''});
        autostarts[presetName] ? ac.start(presetName) : false;
    }
};

exports.start = function() {
    setTimeout(checkServers, cfg.ACM.watchdog.interval);
    autoStart();
};

