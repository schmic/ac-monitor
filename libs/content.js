var fs = require('fs');
var fsExtra = require('fs-extra');
var env = require('ac-server-ctrl').env;

exports.cars = require('./content-car');
exports.tracks = require('./content-tracks');

exports.createContent = function(contentPath, content) {
    try {
        fsExtra.mkdirsSync(contentPath);
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

exports.deleteContent = function(contentPath) {
    try {
        fsExtra.removeSync(contentPath);
        return true;
    }
    catch(e) {
        console.error(e);
        return false;
    }
};

exports.getContent = function(contentPath) {
    var content = [];
    fs.readdirSync(contentPath).every(
        function checkItem(dirItem) {
            if (fs.lstatSync(path.join(contentPath, dirItem)).isDirectory()) {
                content.push(dirItem);
            }
        }
    );
    return content;
};

exports.createPreset = function(presetName, content) {
    return this.createContent(path.join(env.getPresetsPath(), presetName), content);
};

exports.createTrack = function(trackName, content) {
    return this.createContent(path.join(env.getTracksPath(), trackName, 'data'), content);
};

exports.createCar = function(carName, content) {
    return this.createContent(path.join(env.getCarsPath(), carName, 'ui'), content);
};

exports.deletePreset = function(presetName) {
    return this.deleteContent(path.join(env.getPresetsPath(), presetName));
};
exports.deleteTrack = function(trackName) {
    return this.deleteContent(path.join(env.getTracksPath(), trackName));
};
exports.deleteCar = function(carName) {
    return this.deleteContent(path.join(env.getCarsPath(), carName));
};

exports.getPresetNames = function () {
    return this.getContent(env.getPresetsPath());
};

exports.getTrackNames = function() {
    return this.getContent(env.getTracksPath());
};

exports.getCarNames = function() {
    return this.getContent(env.getCarsPath());
};
