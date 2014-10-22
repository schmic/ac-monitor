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

socket.cb = function(data) {
    console.log(data);
    if(data.reload) location.reload();
};

function handleBookEvent(event_id, booking) {
    var wsfunc = 'user.event.saveBooking';
    var msg = {
        reload: true,
        data: {
            event_id: event_id,
            booking: booking
        }
    };
    socket.emit(wsfunc, msg, socket.cb);
}

function closeMessageBox() {
    setTimeout(function() {
        $('#messagebox').hide();
    }, 1000);
}