var Event  = require('../models/event');
var User = require('../models/user');
var printf = require('util').format;

var saveEventBooking = function(socket, data, fn) {
    User.findBySteamId(socket.handshake.session.passport.user.steamid, function(err, user) {
        var booking = {};
        booking.NAME = user.firstname + ' ' + user.lastname;
        booking.GUID = user.steamid;
        booking.CAR = data.car;
        Event.saveBooking(data.event_id, booking, function(err, result) {
            var res = {};
            res.msg = printf('book.result [%s]', result);
            res.type = 'success';
            res.reload = true;
            console.log(res.msg);
            fn(res);
        });
    });
};

var removeEventBooking = function(socket, data, fn) {
    User.findBySteamId(socket.handshake.session.passport.user.steamid, function(err, user) {
        Event.removeBooking(data.event_id, user.steamid, function (err, result) {
            var call = {};
            call.msg = printf('book.result [%s]', result);
            call.type = 'success';
            call.reload = true;
            console.log(call.msg);
            fn(call);
        });
    });
};

var saveUserProfile = function(socket, data, fn) {
    User.findBySteamId(socket.handshake.session.passport.user.steamid, function(err, profile) {
        profile.firstname = data.firstname;
        profile.lastname = data.lastname;
        User.save(profile, function(err, res) {
            fn(call);
        });
    });
};

module.exports = function(socket) {
    socket.on('user.event.saveBooking', saveEventBooking.bind(null, socket));
    socket.on('user.event.removeBooking', removeEventBooking.bind(null, socket));
    socket.on('user.profile.save', saveUserProfile.bind(null, socket));
};