#!/usr/bin/env node
var cfg = require('config');
var app = require('./acMonitorApp');

app.listen(cfg.get('http.port'), function() {
    console.log('Express server listening on port ' + cfg.http.port);
    console.log('Access acMonitor at', 'http://' + cfg.http.host + (cfg.http.port !== 80 ? ':'+cfg.http.port : ''));
});
