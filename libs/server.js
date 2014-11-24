var path = require('path');
var fs = require('fs');
    fs.extra = require('fs-extra');
var env = require('./env');

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
    var events = require('events');
    var eventEmitter = new events.EventEmitter();

    var preset = require('./preset')(presetName);
    prepareServerPath(preset);

    return {
        preset: preset,
        name: preset.serverName,
        pidFile: getPidFile(preset),
        workPath: getServerWorkPath(preset),
        log: undefined,
        proc: undefined,
        // objects
        session: {
            track: undefined,
            name: undefined,
            index: undefined,
            type: undefined,
            time: undefined,
            laps: undefined,
            drivers : {},
            laptimes : {}
        },
        // events
        on: eventEmitter.on,
        emit: eventEmitter.emit
    }
};
