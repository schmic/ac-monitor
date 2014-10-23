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

function handleSaveBooking(event_id) {
    var wsfunc = 'user.event.saveBooking';
    var data = {
        event_id: event_id,
        car: $('#bookcar').val()
    };
    socket.emit(wsfunc, data, socket.cb);
}

function handleRemoveBooking(event_id) {
    var wsfunc = 'user.event.removeBooking';
    var data = {
        event_id: event_id,
    };
    socket.emit(wsfunc, data, socket.cb);
}

function handleSaveProfile() {
    var profile = {
        firstname: $('#profileFirstname').val(),
        lastname: $('#profileLastname').val()
    };
    var wsfunc = 'user.profile.save';
    socket.emit(wsfunc, profile, socket.cb);
}