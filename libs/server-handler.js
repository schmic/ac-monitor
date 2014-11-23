var es = require('event-stream');
var fs = require('fs');
var path = require('path');
var env = require('./env');

var servers = [];

var start = function(presetName) {
    var server = require('./server')(presetName);
    if (isRunning(server)) {
        throw new Error('Preset ' + preset.presetName + ' is already active');
    }

    var args = [
        '-c', path.join(server.workPath, 'server_cfg.ini'),
        '-e', path.join(server.workPath, 'entry_list.ini')
    ];
    server.proc = require('child_process').spawn(env.getServerExecutable(), args, { cwd: env.getACPath() });

    server.proc.on('exit', server.handleExit.bind(null, server));
    server.proc.on('SIGINT', server.handleExit.bind(null, server));
    server.proc.on('uncaughtException', server.handleExit.bind(null, server));

    require('./server-parser')(server, es.merge(server.proc.stdout, server.proc.stderr));

    fs.writeFile(server.pidFile, server.proc.pid, function(err) {
        if(err) return console.error(err);
    });

    console.log('Started server', server.name, 'PID:', server.proc.pid);
    servers[presetName] = server;
    return true;
};

var stop = function(presetName) {
    var server = servers[presetName];
    server.proc.kill();
    console.log('Stopped server', server.name, 'PID:', server.proc.pid);
    delete servers[presetName];
    return true;
};

var status = function(server) {
    if (fs.existsSync(server.pidFile) === false) {
        return 0;
    }
    if(server.proc === undefined) {
        return 0;
    }
    try {
        process.kill(server.proc.pid, 0);
        return 1;
    }
    catch (e) {
        fs.unlink(server.pidFile, function(err) {
            if(err) return console.error(err);
        });
        return -1;
    }
};

var isRunning = function(server) {
    return status(server) === 1;
};

module.exports = {
    servers: servers,
    start: start,
    stop: stop,
    status: status,
    isRunning: isRunning
};

