var cfg = require('config');
var ac = require('./server-handler');
var db = require('./db');

var checkServers = function () {
    for (var presetName in ac.servers) {
        if(ac.status(ac.servers[presetName]) < 1) {
            console.error('Dead server', presetName, 'found');
            db.addHistory({user: 'Watchdog', msg:'Preset ' + presetName + ' found dead'});
            delete ac.servers[presetName];
            autoRestart(presetName);
        }
    }
    setTimeout(checkServers, cfg.ACM.watchdog.interval);
};

var autoRestart = function (presetName) {
    var restart = cfg.ACM.autostart[presetName];
    if (restart) {
        db.addHistory({user: 'Watchdog', msg:'Restart ' + presetName + ''});
        console.log('Restarting', presetName);
        ac.start(presetName);
    }
};

var autoStart = function () {
    var autostarts = cfg.ACM.autostart;
    for (var presetName in autostarts) {
        if(autostarts[presetName]) {
            db.addHistory({user: 'Watchdog', msg:'Autostart ' + presetName + ''});
            console.log('Autostarting', presetName);
            ac.start(presetName);
        }
    }
};

exports.start = function() {
    setTimeout(checkServers, cfg.ACM.watchdog.interval);
    autoStart();
};

