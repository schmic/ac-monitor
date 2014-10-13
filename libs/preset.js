var fs = require('fs');
var path = require('path');
var env = require('./env');

var getDrivers = function (entries) {
    var drivers = {};
    for (var i = 0; i < Object.keys(entries).length; i++) {
        var driver = {
            sid: i,
            model: entries['CAR_' + i].MODEL,
            name: entries['CAR_' + i].DRIVERNAME,
            skin: entries['CAR_' + i].SKIN,
            guid: entries['CAR_' + i].GUID
        };
        drivers[driver.sid] = driver;
    }
    return drivers;
};

var readIni = function(filePath, fileName, callback) {
    var content = fs.readFileSync(path.join(filePath, fileName)).toString('UTF-8');
    return require('ini').parse(content);
};

var getTimeOfDay = function(sunAngle) {
    // base time for angle=0: 1PM // 13:00
    // min/max: -/+ 80
    var someDate = new Date(1970, 1, 1, 13, 0, 0, 0);
    someDate.setMinutes(someDate.getMinutes() + (sunAngle / 16 * 60));
    return someDate.toLocaleTimeString();
};

var getCars = function(c) {
    return c.split(';');
};

var getTracks = function(t) {
    return t.split(';');
};

function Preset(presetName) {
    var ini = readIni(env.getPresetPath(presetName), 'server_cfg.ini');
    var entries = readIni(env.getPresetPath(presetName), 'entry_list.ini');
    return {
        presetPath: env.getPresetPath(presetName),
        presetName: presetName,
        serverName: ini.SERVER.NAME,
        cars: getCars(ini.SERVER.CARS),
        tracks: getTracks(ini.SERVER.TRACK),
        timeOfDay: getTimeOfDay(ini.SERVER.SUN_ANGLE),
        hasPassword: ini.SERVER.PASSWORD !== undefined,
        hasPenalties : ini.SERVER.ALLOWED_TYRES_OUT < 4,
        hasPickupMode: ini.SERVER.PICKUP_MODE_ENABLED === 1,
        hasRegisterToLobby: ini.SERVER.REGISTER_TO_LOBBY === 1,
        hasTyreWear: ini.SERVER.TYRE_WEAR_RATE > 0,
        hasFuelUsage: ini.SERVER.FUEL_RATE > 0,
        hasDamage: ini.SERVER.DAMAGE_MULTIPLIER > 0,
        hasDynamicTrack: ini.DYNAMIC_TRACK !== undefined,
        dynamicTrack: ini.DYNAMIC_TRACK,
        hasBookingSession: ini.BOOK !== undefined,
        bookingSession: ini.BOOK,
        hasPracticeSession: ini.PRACTICE !== undefined,
        practiceSession: ini.PRACTICE,
        hasQualifySession: ini.QUALIFY !== undefined,
        qualifySession: ini.QUALIFY,
        hasRaceSession: ini.RACE !== undefined,
        raceSession: ini.RACE,
        ini: ini,
        get: function(p) {
            return ini.SERVER[p];
        },
        set: function(p, v) {
            ini.SERVER[p] = v;
        },
        entries : entries,
        drivers: getDrivers(entries)
    };
}

module.exports = Preset;
