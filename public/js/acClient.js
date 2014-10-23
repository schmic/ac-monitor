var socket = io.connect();

socket.on('reconnect', function() {
    console.log('websocket reconnected');
    // TODO - implement message box notification (hide)
});

socket.on('disconnect', function() {
    console.log('websocket disconnected');
    // TODO - implement message box notification (show)
});

socket.on('message', function(data) {
	console.log('[msg]:', data);
});

socket.cb = function(call) {
    console.log(call);
    if(call.reload) location.reload();
};

function handleBookEvent(event_id, booking) {
    var wsfunc = 'user.event.saveBooking';
    var call = {
        reload: true,
        msg: undefined,
        type: undefined,
        data: {
            event_id: event_id,
            booking: booking
        }
    };
    socket.emit(wsfunc, call, socket.cb);
}
