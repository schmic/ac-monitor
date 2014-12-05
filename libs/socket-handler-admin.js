var History = require('../models/history');
var contentHandler = require('./content-handler');

var printf = require('util').format;

function deletePreset(data, cb) {
    data.valid = contentHandler.deletePreset(data.name);
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'deleted' : 'could not be deleted');
    console.log('admin.presets.delete', data);
    cb(data);
}

function validatePreset(data, cb) {
    data.valid = contentHandler.hasPreset(data.name) ? false : true;
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'validated' : 'already exists');
    console.log('admin.presets.validate', data);
    cb(data);
}

function savePreset(data, cb) {
    data.valid = contentHandler.createPreset(data.name, data.content);
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'created' : 'could not be created');
    console.log('admin.presets.upload', data);
    cb(data);
}

function startServer(socket, data, cb) {
    data.valid = require('ac-server-ctrl').start(data.name);
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'started' : 'could not be started');
    console.log('admin.server.start', data);
    var user = socket.handshake.session.passport.user || 'Nobody';
    History.add(user,  data.msg, function(err, res) {
        if(err) return console.error(err);
        cb(data);
    });
}

function stopServer(socket, data, cb) {
    data.valid = require('ac-server-ctrl').stop(data.name);
    data.msg = printf('Preset %s %s', data.name, data.valid ? 'stopped' : 'could not be stopped');
    console.log('admin.server.stop', data);
    var user = socket.handshake.session.passport.user || 'Nobody';
    History.add(user, data.msg, function(err, res) {
        if(err) return console.error(err);
        cb(data);
    });
}

module.exports = function(socket) {
    //socket.on('admin.tracks.delete', deleteTrack);
    //socket.on('admin.tracks.validate', validateTrack);
    //socket.on('admin.tracks.upload', saveTrack);
    //socket.on('admin.cars.delete', deleteCar);
    //socket.on('admin.cars.validate', validateCar);
    //socket.on('admin.cars.upload', saveCar);
    socket.on('admin.presets.delete', deletePreset);
    socket.on('admin.presets.validate', validatePreset);
    socket.on('admin.presets.upload', savePreset);
    socket.on('admin.server.start', startServer.bind(null, socket));
    socket.on('admin.server.stop', stopServer.bind(null, socket));
};