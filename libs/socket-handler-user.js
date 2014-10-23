var Event  = require('../models/event');
var printf = require('util').format;

var saveEventBooking = function(socket, call, fn) {
    Event.saveBooking(call.data.event_id, call.data.booking, function(err, result) {
        call.msg = printf('book.result [%s]', result);
        call.type = 'success';
        call.reload = true;
        console.log(call.msg);
        fn(call);
    });
};

var removeEventBooking = function(socket, call, fn) {
    Event.removeBooking(call.data.event_id, call.data.user_id, function(err, result) {
        call.msg = printf('book.result [%s]', result);
        call.type = 'success';
        call.reload = true;
        console.log(call.msg);
        fn(call);
    });
};

var saveUserProfile = function(socket, call, fn) {
    var User = require('../models/user');
    User.findBySteamId(socket.handshake.session.passport.user.steamid, function(err, profile) {
        profile.firstname = call.data.firstname;
        profile.lastname = call.data.lastname;
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