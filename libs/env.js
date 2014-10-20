var path = require('path');
var fs = require('fs');
    fs.extra = require('fs-extra');
var cfg = require('config');

var isWindows = require('os').platform().match(/win/i);

exports.getServerExecutable = function() {
    return path.join(this.getACPath(), isWindows ? 'acServer.exe' : 'acServer');
};

exports.getACPath = function() {
    return cfg.get('AC.installpath');
};

exports.getServersPath = function() {
    return path.join(this.getACPath(), 'servers');
};

exports.getCarsPath = function() {
    return path.join(this.getACPath(), 'content', 'cars');
};

exports.getCarNames = function() {
    var cars = [];
    var carsPath = this.getCarsPath();
    try {
        fs.readdirSync(carsPath).every(
            function checkItem(dirItem) {
                if (fs.lstatSync(path.join(carsPath, dirItem)).isDirectory()) {
                    cars.push(dirItem);
                }
                return true;
            }
        );
    }
    catch(e) {
        console.error(e);
    }
    return cars;
};

exports.getTracksPath = function() {
    return path.join(this.getACPath(), 'content', 'tracks');
};

exports.createContent = function(contentPath, content) {
    try {
        fs.extra.mkdirsSync(contentPath);
        Object.keys(content).forEach(function(fileName) {
            fs.writeFileSync(path.join(contentPath, fileName), content[fileName]);
        });
        return true;
    }
    catch(e) {
        console.error(e);
        return false;
    }
};

exports.createPreset = function(presetName, content) {
    return this.createContent(path.join(this.getPresetsPath(), presetName), content);
};

exports.createTrack = function(trackName, content) {
    return this.createContent(path.join(this.getTracksPath(), trackName, 'data'), content);
};

exports.createCar = function(carName, content) {
    return this.createContent(path.join(this.getCarsPath(), carName, 'ui'), content);
};

exports.deleteContent = function(contentPath) {
    try {
        fs.extra.removeSync(contentPath);
        return true;
    }
    catch(e) {
        console.error(e);
        return false;
    }
};

exports.deletePreset = function(presetName) {
    return this.deleteContent(path.join(this.getPresetsPath(), presetName));
};

exports.deleteTrack = function(trackName) {
    return this.deleteContent(path.join(this.getTracksPath(), trackName));
};

exports.deleteCar = function(carName) {
    return this.deleteContent(path.join(this.getCarsPath(), carName));
};

exports.hasTrack = function(checkTrack) {
    var exists = false;
    this.getTrackNames().forEach(function (track) {
        if (track === checkTrack) {
            exists = true;
        }
    });
    return exists;
};

exports.hasCar = function(checkCar) {
    var exists = false;
    this.getCarNames().forEach(function (car) {
        if (car === checkCar) {
            exists = true;
        }
    });
    return exists;
};

exports.hasPreset = function(checkPreset) {
    var exists = false;
    this.getPresetNames().forEach(function(preset) {
        if(preset === checkPreset) {
            exists = true;
        }
    });
    return exists;
};

exports.getTrackNames = function() {
    var tracks = [];
    var tracksPath = this.getTracksPath();
    try {
        fs.readdirSync(tracksPath).every(
            function checkItem(dirItem) {
                if (fs.lstatSync(path.join(tracksPath, dirItem)).isDirectory()) {
                    tracks.push(dirItem);
                }
                return true;
            }
        );
    }
    catch(e) {
        console.error(e);
    }
    return tracks;
};

exports.getPresetNames = function (filter) {
    var presetRegExp = new RegExp(filter, 'i');
    var presetsMatched = [];
    var presetsPath = this.getPresetsPath();
    fs.readdirSync(presetsPath).every(
        function checkItem(dirItem) {
            if (dirItem.match(presetRegExp)) {
                if (fs.lstatSync(path.join(presetsPath, dirItem)).isDirectory()) {
                    presetsMatched.push(dirItem);
                }
            }

            return true;
        }
    );
    return presetsMatched;
};

exports.getPresetName = function (presetPrefix) {
    var presetsMatched = this.getPresetNames(presetPrefix);
    if (presetsMatched.length === 0) {
        return false;
    }
    return presetsMatched[0];
};

exports.getPresetsPath = function() {
    return path.join(this.getACPath(), 'presets');
};

exports.getPresetPath = function(presetPrefix) {
    return path.join(this.getPresetsPath(), this.getPresetName(presetPrefix));
};

fs.extra.ensureDirSync(exports.getServersPath());
fs.extra.ensureDirSync(exports.getCarsPath());
fs.extra.ensureDirSync(exports.getTracksPath());

if(!fs.existsSync(exports.getServerExecutable())) {
    console.error('AC server binary "' + exports.getServerExecutable() + '" not found, aborting ...');
    console.error(' Please execute acCtrl from within the AC Dedicated Server Directory');
    process.exit(1);
}
