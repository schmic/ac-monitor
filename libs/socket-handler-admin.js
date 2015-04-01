var format = require('util').format;

var ac = require('ac-server-ctrl');
var content = require('./content');
var History = require('../models/history');
var Event = require('../models/event');

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

function startServer(data, cb) {
    ac.start(data.name, function(presetName) {
        data.valid = true;
        data.msg = format('Preset %s %s', presetName, data.valid ? 'started' : 'could not be started');
        cb(data);
        console.log('admin.server.start', data);

        var user = socket.handshake.session.passport.user || 'Nobody';
        History.add(user,  data.msg);
    });
}

function stopServer(data, cb) {
    ac.stop(data.name, function(presetName) {
        data.valid = true;
        data.msg = format('Preset %s %s', presetName, data.valid ? 'stopped' : 'could not be stopped');
        cb(data);
        console.log('admin.server.stop', data);

        var user = socket.handshake.session.passport.user || 'Nobody';
        History.add(user, data.msg);
    });
}

function startEvent(data, fn) {
    console.error('admin.event.start:id', data.id);

    require('./event-util').start(data.id , function(err) {
        if(err) {
            console.error(err);
        }
        data.valid = err ? false : true;
        data.msg = format('Event %s %s', data.id, data.valid ? 'started' : 'could not be started');
        fn(data);

        var user = socket.handshake.session.passport.user || 'Nobody';
        History.add(user, data.msg);
    })
}

function saveEvent(data, fn) {
    Event.save(data, function(err, event) {
        if(err)
            console.error(err);
        data.valid = err ? false : true;
        data.msg = format('Event %s %s', data.name, data.valid ? 'saved' : 'could not be saved');
        fn(data);

        var user = socket.handshake.session.passport.user || 'Nobody';
        History.add(user, data.msg);
    });
}

function removeEvent(data, fn) {
    Event.remove(data.id, function(err) {
        if(err)
            console.error(err);
        data.valid = err ? false : true;
        data.msg = format('Event %s %s', data.name, data.valid ? 'removed' : 'could not be removed');
        fn(data);
        console.log('admin.event.save', data);

        var user = socket.handshake.session.passport.user || 'Nobody';
        History.add(user, data.msg);
    });
}

var socket;
module.exports = function(theSocket) {
    socket = theSocket;
    socket.on('admin.event.start', startEvent);
    socket.on('admin.event.save', saveEvent);
    socket.on('admin.event.remove', removeEvent);
    socket.on('admin.presets.delete', deletePreset);
    socket.on('admin.presets.validate', validatePreset);
    socket.on('admin.presets.upload', savePreset);
    socket.on('admin.server.start', startServer);
    socket.on('admin.server.stop', stopServer);
};