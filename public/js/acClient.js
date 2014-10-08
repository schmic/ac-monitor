var socket = io.connect();

socket.on('reconnect', function() {
	//window.location = '/';
});

socket.on('disconnect', function() {
	//replaceContent('<div class="container"><div class="jumbotron"><b>Connection lost, reconnecting...</b></div></div>');
});

socket.on('message', function(data) {
	console.log('Msg:', data);
});

// -------------------------------------------------------------------------- //

// -------------------------------------------------------------------------- //

function closeMessageBox() {
    setTimeout(function() {
        $('#messagebox').hide();
    }, 1000);
}