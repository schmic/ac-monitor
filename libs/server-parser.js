var es = require('event-stream');

var sessionTypes = {
    0: "BOOKING",
    1: "PRACTICE",
    2: "QUALIFY",
    3: "RACE"
};

var acRE = {};
acRE.addDriver = /Adding car: SID:(\d+) name=(.+) model=(.+) skin=(.+) guid=(\d+)/;
acRE.delDriver = /Removing car sid:(\d+) name=(.+) model=([^ ]+) guid=(\d+)/;
acRE.carEntry = /CAR_\d+\nSESSION_ID:(\d+)\nMODEL: (\w+) \(\d+\) .*\nDRIVERNAME: (.*)\nGUID:(\d+)/;
acRE.sessionChange = /SENDING session name : (.*)\nSENDING session index : (\d+)\nSENDING session type : (\d+)\nSENDING session time : (\d+)\nSENDING session laps : (\d+)/
acRE.sessionDone = /HasSentRaceoverPacket, move to the next session\nRACE OVER PACKET, FINAL RANK/;
acRE.noCarWithAddress = /^No car with address/;
acRE.lapTime = /^LAP (.*) (\d+:\d+:\d+)$/;
acRE.track = /^TRACK=(.*)$/;

var buffer = [];
var bufferLines = '';
var bufferMaxLength = 5;

var getLogfileName = function(workPath) {
    var timeString = (new Date().toISOString()).replace(/[-T:]/g, '').split('.').shift();
    return require('path').join(workPath, timeString + '-server.log');
};

var resetBuffer = function() {
    buffer = [];
    bufferLines = '';
};

exports.listen = function (server) {
    var stream = es.merge(server.proc.stdout, server.proc.stderr);
    stream.pipe(es.split())

        // ignore certain lines, fill buffer
        .pipe(es.map(function (line, cb) {
            if (acRE.noCarWithAddress.test(line)) {
                cb();
            }
            else {
                buffer.push(line);
                if (buffer.length > bufferMaxLength )
                    buffer.shift();
                bufferLines = buffer.join('\n');
                cb(null, line);
            }
        }))

        // File-Logger
        .pipe(es.map(function (line, cb) {
            // FIXME - might lose some data if server is killed too fast?
            if(server.log === undefined) {
                server.log = require('fs').createWriteStream(getLogfileName(server.workPath), { flags: 'w+', encoding: 'UTF-8' });
            }
            server.log.write(line + "\n");
            cb(null, line);
        }))

        // session handling
        .pipe(es.map(function (line, cb) {
            if(acRE.track.test(line)) {
                var matches = line.match(acRE.track);
                server.session.track = matches[1];
                server.emit('track', server.session.track);
            }

            if(acRE.sessionChange.test(bufferLines)) {
                server.emit('endsession', server.session);

                var matches = bufferLines.match(acRE.sessionChange);
                server.session.name = matches[1];
                server.session.index = parseInt(matches[2]);
                server.session.type = sessionTypes[matches[3]];
                server.session.time = parseInt(matches[4]);
                server.session.laps = (matches[5]);
                server.session.laptimes = {};
                resetBuffer();

                server.emit('nextsession', server.session);
            }

            if(acRE.sessionDone.test(bufferLines)) {
                resetBuffer();
                server.emit('endsession', server.session);
                server.emit('stopserver', server.preset.presetName);
            }

            cb(null, line);
        }))

        // driver handling
        .pipe(es.map(function (line, cb) {
            if(acRE.carEntry.test(bufferLines)) {
                var matches = bufferLines.match(acRE.carEntry);
                var car = {
                    "SESSION_ID": matches[1],
                    "MODEL": matches[2],
                    "DRIVERNAME": matches[3],
                    "GUID": matches[4]
                };
                resetBuffer();
                server.session.drivers[car.GUID] = car;
                server.emit('addcar', car);
            }

            else if(acRE.addDriver.test(bufferLines)) {
                var matches = line.match(acRE.addDriver);
                var car = {
                    "SESSION_ID": matches[1],
                    "MODEL": matches[3],
                    "DRIVERNAME": matches[2],
                    "GUID": matches[4]
                };
                resetBuffer();
                server.session.drivers[car.GUID] = car;
                server.emit('addcar', car);
            }

            else if(acRE.delDriver.test(bufferLines)) {
                var matches = line.match(acRE.delDriver);
                resetBuffer();
                var car = server.session.drivers[matches[4]];
                delete server.session.drivers[matches[4]];
                server.emit('delcar', car);
            }

            cb(null, line);
        }))

        // Booking-Logger
        .pipe(es.map(function (line, cb) {
            // TODO -- implement booking logger
            cb(null, line);
        }))

        // LapTimes-Logger
        .pipe(es.map(function (line, cb) {
            var toSeconds = function (timeStr) {
                var timeParts = timeStr.split(':');
                return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) + parseInt(timeParts[2]) / 1000;
            };

            var driverByName = function(session, name) {
                var driver = undefined;
                Object.keys(session.drivers).some(function(k) {
                    var nameRE = new RegExp(name, 'i');
                    if(session.drivers[k].DRIVERNAME.match(nameRE)) {
                        driver = session.drivers[k];
                        return true;
                    }
                });
                return driver;
            };

            if (acRE.lapTime.test(line)) {
                var matches = line.match(acRE.lapTime);
                var lapTime = toSeconds(matches.pop());
                var driver = driverByName(server.session, matches.pop());

                if (server.session.laptimes[driver.GUID] == undefined) {
                    server.session.laptimes[driver.GUID] = {
                        "driver": driver.DRIVERNAME,
                        "car": driver.MODEL,
                        "track": server.session.track,
                        "guid": driver.GUID,
                        "laptime": lapTime,
                        "time": new Date().toISOString(),
                        "session": server.session.type
                    };
                    server.emit('bestlap', server.session.laptimes[driver.GUID])
                }
                else if (server.session.laptimes[driver.GUID].time > lapTime) {
                    server.session.laptimes[driver.GUID].time = lapTime;
                    server.emit('bestlap', server.session.laptimes[driver.GUID])
                }
            }
            cb(null, line);
        }));
};
