var cfg = require('config');
var ac = require('./server-handler');
var History = require('../models/history');

var checkServers = function () {
    for (var presetName in ac.servers) {
        if(ac.status(ac.servers[presetName]) < 1) {
            History.add('Watchdog', 'Preset ' + presetName + ' found dead', function(err, res) {
                if(err) return console.error(err);
                console.error('Dead server', presetName, 'found');
            });
            delete ac.servers[presetName];
            autoRestart(presetName);
        }
    }
    setTimeout(checkServers, cfg.ACM.watchdog.interval);
};

var autoRestart = function (presetName) {
    var restart = cfg.ACM.autostart[presetName];
    if (restart) {
        History.add('Watchdog', 'Restart ' + presetName + '', function(err, res) {
            if(err) return console.error(err);
            console.log('Restarting', presetName);
        });
        ac.start(presetName);
    }
};

var autoStart = function () {
    var autostarts = cfg.ACM.autostart;
    for (var presetName in autostarts) {
        if(autostarts[presetName]) {
            History.add('Watchdog', 'Autostart ' + presetName + '', function(err, res) {
                if(err) return console.error(err);
                console.log('Autostarting', presetName);
            });
            ac.start(presetName);
        }
    }
};

exports.start = function() {
    setTimeout(checkServers, cfg.ACM.watchdog.interval);
    autoStart();
};
