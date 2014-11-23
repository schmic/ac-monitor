var es = require('event-stream');

var acRE = {};
acRE.callingRegisterRegExp = /CALLING (http.*\/register.*)/;
acRE.nextSessionRegExp = /NextSession\nSESSION: ([^\n]+)\nTYPE=(\w+)\nTIME=(\d+)\nLAPS=(\d+)/;
acRE.carRegExpG = /CAR_\d+\nSESSION_ID:(\d+)\nMODEL: (\w+) .*\]\nDRIVERNAME: (.*)\nGUID:(\d+)/g;
acRE.carRegExp = /CAR_\d+\nSESSION_ID:(\d+)\nMODEL: (\w+) .*\]\nDRIVERNAME: (.*)\nGUID:(\d+)/;
acRE.addDriverRegExp = /Adding car: SID:(\d+) name=(.+) model=(.+) skin=(.+) guid=(\d+)/;
acRE.delDriverRegExp = /Removing car sid:(\d+) name=(.+) model=([^ ]+) guid=(\d+)/;

acRE.noCarWithAddress = /^No car with address/;
acRE.lapTimeRegExp = /^LAP (.*) (\d+:\d+:\d+)$/;

var buffer = [];
var bufferLines = '';

var getLogfile = function(workPath) {
    var timeString = (new Date().toISOString()).replace(/[-T:]/g, '').split('.').shift();
    return path.join(workPath, timeString + '-server.log');
};

module.exports = function (server, stream) {
    stream.pipe(es.split())

        // ignore certain lines, fill buffer
        .pipe(es.map(function (line, cb) {
            if (acRE.noCarWithAddress.test(line)) {
                cb();
            }
            else {
                buffer.push(line);
                if(buffer.length > 5)
                    buffer.shift();
                bufferLines = buffer.join('\n');

                if(acRE.nextSessionRegExp.test(bufferLines)) {
                    var matches = bufferLines.match(acRE.nextSessionRegExp);
                    console.log('new session', matches[0]);
                    server.session = {
                        laptimes : {},
                        drivers: {}
                    }
                }
                cb(null, line);
            }
        }))

        // Booking-Logger
        .pipe(es.map(function (line, cb) {
            if (acRE.addDriverRegExp.test(line)) {
                var matches = line.match(addDriverRegExp);
                console.log('Booking:', matches);
            }
            cb(null, line);
        }))

        // LapTimes-Logger
        .pipe(es.map(function (line, cb) {
            var toSeconds = function (timeStr) {
                var timeParts = timeStr.split(':');
                var seconds = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 1000;
                return seconds;
            };

            if (acRE.lapTimeRegExp.test(line)) {
                var matches = line.match(acRE.lapTimeRegExp);
                var lapTime = toSeconds(matches.pop());
                var driverName = matches.pop();

                if (server.session.laptimes[driverName] == undefined) {
                    server.session.laptimes[driverName] = {
                        "driver": driverName,
                        "time": lapTime
                    }
                }
                else if (server.session.laptimes[driverName].time > lapTime) {
                    server.session.laptimes[driverName].time = lapTime;
                }

            }
            cb(null, line);
        }));
};
