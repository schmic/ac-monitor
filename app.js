#!/usr/bin/env node
var app = require('./acMonitorApp');
var cfg = require('./config');
var acMonitorApp = app.listen(cfg.http.port, function() {
    console.log('Express server listening on port ' + acMonitorApp.address().port);
});
