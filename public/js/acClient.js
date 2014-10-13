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

function closeMessageBox() {
    setTimeout(function() {
        $('#messagebox').hide();
    }, 1000);
}