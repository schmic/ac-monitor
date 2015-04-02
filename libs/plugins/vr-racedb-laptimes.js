var cfg = require('config');
var request = require('request');
var ac = require('ac-server-ctrl');

var options = {
    "url": undefined,
    "method": "POST",
    "json": true
};

ac.on(ac.events.server.start, function (server) {
    if(cfg.has('vr.racedb.url')) {
        options.url = cfg.get('vr.racedb.url');
    }
    else {
        return;
    }

    console.info('[plugin]', 'vr-laptime connected to:', server.preset.serverName);

    server.on(ac.events.lap.time, function(lap) {
        if(lap.trackConfig) {
            lap.track += '-' + lap.trackConfig;
            delete lap.trackConfig;
        }
        options.body = lap;
        request.post(options, function(err, resp, body) {
            if(err) {
                console.error(err);
            }
            console.log('lap.post', lap, '\n', body);
        });
    });
});

module.exports = {};