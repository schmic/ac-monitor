var cfg = require('config');
var moment = require('moment');
var ac = require('ac-server-ctrl');
var History = require('../models/history');
var Events = require('../models/event');

var checkEvents = function() {
    var now = moment().unix();
    var last = now-cfg.get('watchdog.interval');

    Events.list(function(err, events) {
        if(err)
            return console.error(err);
        events.forEach(function(event) {
            if(event.tstamp <= now && event.tstamp >= last) {
                console.warn('[TODO] checkEvents() - handle event', event);
            }
        });
    })
};

var checkServers = function () {
    for (var presetName in ac.servers) {
        ac.status(presetName, function(presetName, status) {
            if(status < 0) {
                History.add('Watchdog', 'Preset ' + presetName + ' found dead', function(err) {
                    if(err) { return console.error(err) };
                    console.error('Dead server', presetName, 'found');
                });
                ac.stop(presetName, autoRestart);
            }
        });
    }
};

var autoRestart = function (restartPresetName) {
    for (var idx in cfg.get('autostart')) {
        var presetName = cfg.get('autostart')[idx];
        if (restartPresetName === presetName) {
            console.log('Restarting', presetName);
            ac.start(presetName, function(presetName) {
                History.add('Watchdog', 'Restart ' + presetName + '', function(err) {
                    if(err) return console.error(err);
                });
            });
        }
    }
};

var autoStart = function () {
    var fs = require('fs');
    var startServers = cfg.get('autostart');

    if(fs.existsSync('config/running.json')) {
        var data = fs.readFileSync('config/running.json', { encoding: 'UTF-8' });
        startServers = startServers.concat(JSON.parse(data).servers);
        startServers = startServers.filter(function(elem, pos) {
            return startServers.indexOf(elem) == pos;
        });
    }

    console.log('Autostart for presets:', startServers);

    for (var idx in startServers) {
        var presetName = startServers[idx];
        console.log('Autostarting', presetName);
        ac.start(presetName, function(presetName) {
            History.add('Watchdog', 'Autostart ' + presetName + '', function(err) {
                if(err) return console.error(err);
            });
        });
    }

};

exports.start = function() {
    setInterval(checkServers, (cfg.get('watchdog.interval')*1000));
    setInterval(checkEvents, (cfg.get('watchdog.interval')*1000));
    autoStart();
};
