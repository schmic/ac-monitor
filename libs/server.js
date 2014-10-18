var path = require('path');
var fs = require('fs');
    fs.extra = require('fs-extra');
var env = require('./env');

var getLogfile = function(workPath, prefix) {
    var timeString = (new Date().toISOString()).replace(/[-T:]/g, '').split('.').shift();
    var logFileName = timeString + '-server.log';
    if(prefix) {
        logFileName = logFileName.replace('-server', '-'+prefix+'-server');
    }
    return path.join(workPath, logFileName);
};

var handleLogging = function(server, data, callback) {
    callback(null, data);
    // server loops
    if (data.match(/^Opening entry list:/)) {
        // use new log file
        server.logFile = getLogfile(server.workPath);
        console.log('new.logfile', server.logFile);
    }
    fs.appendFileSync(server.logFile, data+'\n');
    console.log('[LOG]', data);
};

var handleError = function(server, data, callback) {
    callback(null, data);
    if(data.length === 0)
        return;
    fs.appendFileSync(server.logFile.replace('.log', '.err'), data+'\n');
    console.log('[ERR]', data);
};

var handleExit = function(server) {
    fs.unlink(server.pidFile, function(err) {
        if(err) return console.error(err);
        console.log('Server process exit, removing pid file: ', server.pidFile);
    });
};

var copyFile = function(fromPath, toPath, fileName) {
    return require('fs-sync').copy(
        path.join(fromPath, fileName),
        path.join(toPath, fileName),
        { force: true }
    );
};

var getServerWorkPath = function(preset) {
    return path.join(env.getServersPath(), preset.presetName);
};

var getPidFile = function(preset) {
    return path.join(getServerWorkPath(preset), 'server.pid')
};

var prepareServerPath = function(preset) {
    var serverPath = getServerWorkPath(preset);
    var rc = fs.existsSync(serverPath) ? true : fs.extra.ensureDirSync(serverPath);
    if(rc !== false) {
        ['server_cfg.ini', 'entry_list.ini'].forEach(
            function (fileName) {
                rc = copyFile(preset.presetPath, serverPath, fileName);
            }
        );
    }
    return rc;
};

module.exports = function (presetName) {
    var preset = require('./preset')(presetName);
    return {
        preset: preset,
        name: preset.serverName,
        isReady: prepareServerPath(preset),
        pidFile: getPidFile(preset),
        logFile: getLogfile(getServerWorkPath(preset), 'init'),
        workPath: getServerWorkPath(preset),
        // objects
        proc: undefined,
        session: undefined,
        // functions
        handleExit: handleExit,
        handleLogging: handleLogging,
        handleError: handleError
    }
};
