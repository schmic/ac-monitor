var printf   = require('util').format;

var saveEventBooking = function(socket, msg) {
    require('../models/event').saveBooking(msg.data.event_id, msg.data.booking, function(err, result) {
        console.log('book.result', result);
    });
};

var removeEventBooking = function(socket, msg) {
    require('../models/event').removeBooking(msg.data.event_id, msg.data.user_id, function(err, result) {
        console.log('book.result', result);
    });
};

module.exports = function(socket) {
    socket.on('user.event.saveBooking', saveEventBooking.bind(null, socket));
    socket.on('user.event.removeBooking', removeEventBooking.bind(null, socket));
};