var es = require('event-stream');
var fs = require('fs');
var path = require('path');
var env = require('./env');

/**
 * Container for (running) AC servers
 * @type {{}}
 */
var servers = {};

var start = function(server) {
    if (isRunning(server)) {
        throw new Error('Preset ' + preset.presetName + ' is already active');
    }

    var args = [
        '-c', path.join(server.workPath, 'server_cfg.ini'),
        '-e', path.join(server.workPath, 'entry_list.ini')
    ];
    var proc = require('child_process').spawn(env.getServerExecutable(), args, { cwd: env.getACPath() });

    proc.on('exit', server.handleExit.bind(null, server));
    proc.on('SIGINT', server.handleExit.bind(null, server));
    proc.on('uncaughtException', server.handleExit.bind(null, server));
    proc.stdout.pipe(es.split()).pipe(es.map(server.handleLogging.bind(null, server)));
    proc.stderr.pipe(es.split()).pipe(es.map(server.handleError.bind(null, server)));

    server.proc = proc;

    fs.writeFile(server.pidFile, proc.pid, function(err) {
        if(err) return console.error(err);
    });

    console.log('Started server', server.name, 'PID:', server.proc.pid);
    servers[server.preset.presetName] = server;
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
    console.log('checking server with preset', server.preset.presetName);
    if (fs.existsSync(server.pidFile) === false) {
        return 0;
    }
    if(server.proc === undefined) {
        return 0;
    }
    try {
        process.kill(server.proc.pid, 0);
        console.log('PID', server.proc.pid, 'alive');
        return 1;
    }
    catch (e) {
        console.log('PID', server.proc.pid, 'dead');
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

