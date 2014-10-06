#!/usr/bin/env node
var cfg = require('config');
var app = require('./acMonitorApp');

app.listen(cfg.get('http.port'), function() {
    console.log('acMonitor running at', 'http://' + cfg.http.host + (cfg.http.port !== 80 ? ':'+cfg.http.port : ''));
});
