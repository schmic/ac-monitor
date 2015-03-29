var ac = require('ac-server-ctrl');
var History = require('../models/history');
var Event = require('../models/event');
var content = require('./content-handler');
var format = require('util').format;

function deletePreset(data, cb) {
    data.valid = content.deletePreset(data.name);
    data.msg = format('Preset %s %s', data.name, data.valid ? 'deleted' : 'could not be deleted');
    cb(data);
    console.log('admin.presets.delete', data);
}

function validatePreset(data, cb) {
    data.valid = content.hasPreset(data.name) ? false : true;
    data.msg = format('Preset %s %s', data.name, data.valid ? 'validated' : 'already exists');
    cb(data);
    console.log('admin.presets.validate', data);
}

function savePreset(data, cb) {
    data.valid = content.createPreset(data.name, data.content);
    data.msg = format('Preset %s %s', data.name, data.valid ? 'created' : 'could not be created');
    console.log('admin.presets.upload', data);
    cb(data);
}

function startServer(socket, data, cb) {
    ac.start(data.name, function(presetName) {
        data.valid = true;
        data.msg = format('Preset %s %s', presetName, data.valid ? 'started' : 'could not be started');
        cb(data);
        console.log('admin.server.start', data);

        var user = socket.handshake.session.passport.user || 'Nobody';
        History.add(user,  data.msg, function(err, res) {
            if(err) return console.error(err);
        });
    });
}

function stopServer(socket, data, cb) {
    ac.stop(data.name, function(presetName) {
        data.valid = true;
        data.msg = format('Preset %s %s', presetName, data.valid ? 'stopped' : 'could not be stopped');
        cb(data);
        console.log('admin.server.stop', data);

        var user = socket.handshake.session.passport.user || 'Nobody';
        History.add(user, data.msg, function(err, res) {
            if(err) return console.error(err);
        });
    });
}

function saveEvent(socket, data, fn) {
    Event.save(data, function(err, event) {
        if(err)
            console.error(err);
        data.valid = err ? false : true;
        data.msg = format('Event %s %s', data.name, data.valid ? 'saved' : 'could not be saved');
        fn(data);
        console.log('admin.event.save', data);

        var user = socket.handshake.session.passport.user || 'Nobody';
        History.add(user, data.msg, function(err, res) {
            if(err)
                console.error(err);
        });
    });
}

function removeEvent(socket, data, fn) {
    Event.remove(data.id, function(err) {
        if(err)
            console.error(err);
        data.valid = err ? false : true;
        data.msg = format('Event %s %s', data.name, data.valid ? 'removed' : 'could not be removed');
        fn(data);
        console.log('admin.event.save', data);

        var user = socket.handshake.session.passport.user || 'Nobody';
        History.add(user, data.msg, function(err, res) {
            if(err)
                console.error(err);
        });
    });
}

module.exports = function(socket) {
    socket.on('admin.event.save', saveEvent.bind(null, socket));
    socket.on('admin.event.remove', removeEvent.bind(null, socket));
    socket.on('admin.presets.delete', deletePreset);
    socket.on('admin.presets.validate', validatePreset);
    socket.on('admin.presets.upload', savePreset);
    socket.on('admin.server.start', startServer.bind(null, socket));
    socket.on('admin.server.stop', stopServer.bind(null, socket));
};