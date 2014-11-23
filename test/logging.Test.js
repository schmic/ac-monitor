var fs = require('fs');
var env = require('../libs/env');
var path = require('path');
var es = require('event-stream');

var serverDir = path.join(env.getServersPath(), 'CCN1_E02-Race-Grid 1')
var logFile = path.join(serverDir, '20141116180235-server.log');


fs.createReadStream(logFile)
    .pipe(es.split())
    .pipe(es.map(function(line, cb) {
        if(line.match(/^No car with address/))
            cb();
        else
           cb(null, line);
    }))
    .pipe(es.map(function(line, cb) {
        if(line.match(/^LAP/))
            console.log(line);
        cb(null, line);
    }));