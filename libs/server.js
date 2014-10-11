var acPreset = require('./preset');

var path = require('path');
var fs = require('fs');
var es = require('event-stream');
var env = require('./env');

var handleLogging = function(data, callback) {
    callback(null, data);
    console.log('[LOG]', data);
    if (data.match(/^Opening entry list:/)) {
        this.rotateLogFile();
    }
    fs.appendFileSync(this.getLogFile(), data+'\n');
};

var handleError = function(data, callback) {
    callback(null, data);
    if(data.length === 0)
        return;
    console.log('[ERR]', data);
    fs.appendFileSync(this.getLogFile().replace('.log', '.err'), data+'\n');
};

var handleExit = function() {
    console.log('Server process exit, removing pid file: ', this.getPidFile());
    fs.unlinkSync(this.getPidFile());
};

Server.prototype.rotateLogFile = function(suffix) {
    this.logFileName = new Date().toISOString().replace(/[-T:]/g, '').split('.').shift();
    this.logFileName += suffix ? '-' + suffix : '';
    this.logFileName += '-server.log';
};

Server.prototype.getLogFile = function() {
    return path.join(this.getServerWorkPath(), this.logFileName);
};

Server.prototype.prepareServerPath = function() {
    var serverPath = this.getServerWorkPath();
    if (fs.existsSync(serverPath) === false) {
        fs.mkdirSync(serverPath);
    }
    ['server_cfg.ini', 'entry_list.ini'].forEach(
        function copyFile(filename) {
            var srcDir = this.preset.getPresetPath();
            var dstDir = this.getServerWorkPath();
            var srcFile = path.join(srcDir, filename);
            var dstFile = path.join(dstDir, filename);

            if (fs.existsSync(dstFile)) {
                console.log('removing existing ini:', dstFile);
                fs.unlinkSync(dstFile);
            }

            console.log('copying ini file:', filename);
            console.log('  from:', srcDir);
            console.log('    to:', dstDir);
            require('fs-sync').copy(srcFile, dstFile);
        }.bind(this)
    );
};

Server.prototype.getServerWorkPath = function() {
    return path.join(env.getServersPath(), this.preset.getPresetName());
};

Server.prototype.getPidFile = function() {
    return path.join(this.getServerWorkPath(), 'server.pid');
};

Server.prototype.isRunning = function() {
    return this.status() === 1;
};

Server.prototype.getPreset = function() {
    return this.preset;
};

Server.prototype.status = function() {
    console.log('checking pid-file', this.getPidFile());
    if (fs.existsSync(this.getPidFile())) {
        var pid = fs.readFileSync(this.getPidFile());
        console.log('found pid', pid);
        try {
            process.kill(pid, 0);
            console.log('pid', pid, 'alive');
            return 1;
        }
        catch (e) {
            console.log('pid', pid, 'dead');
            fs.unlinkSync(this.getPidFile());
            return -1;
        }
    }
    return 0;
};

Server.prototype.start = function () {
    if (this.isRunning())
        throw new Error('Preset ' + env.getPresetName() + ' is already active');

    this.rotateLogFile('init');
    console.log('Starting server: ', env.getPresetName());

    var args = [
        '-c', path.join(this.getServerWorkPath(), 'server_cfg.ini'),
        '-e', path.join(this.getServerWorkPath(), 'entry_list.ini')
    ];
    var opts = { cwd: env.getACPath() };

    this.proc = require('child_process').spawn(env.getServerExecutable(), args, opts);
    this.proc.on('exit', handleExit.bind(this));
    this.proc.stdout.pipe(es.split()).pipe(es.map(handleLogging.bind(this)));
    this.proc.stderr.pipe(es.split()).pipe(es.map(handleError.bind(this)));

    console.log('Server-PID: ' + this.proc.pid);
    fs.writeFileSync(this.getPidFile(), this.proc.pid);

    return true;
};

Server.prototype.stop = function () {
    console.log('Stopping server with PID:', this.proc.pid);
    this.proc.kill();
};

function Server(presetName) {
    this.preset = new acPreset(presetName);
    this.prepareServerPath();
}

module.exports = Server;

//EOF