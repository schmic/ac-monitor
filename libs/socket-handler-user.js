var Event  = require('../models/event');
var printf = require('util').format;

var saveEventBooking = function(socket, call) {
    Event.saveBooking(call.data.event_id, call.data.booking, function(err, result) {
        call.msg = printf('book.result [%s]', result);
        call.type = 'success';
        call.reload = true;
        console.log(call.msg);
        fn(call);
    });
};

var removeEventBooking = function(socket, call) {
    Event.removeBooking(call.data.event_id, call.data.user_id, function(err, result) {
        call.msg = printf('book.result [%s]', result);
        call.type = 'success';
        call.reload = true;
        console.log(call.msg);
        fn(call);
    });
};

module.exports = function(socket) {
    socket.on('user.event.saveBooking', saveEventBooking.bind(null, socket));
    socket.on('user.event.removeBooking', removeEventBooking.bind(null, socket));
};