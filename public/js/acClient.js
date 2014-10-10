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
    location.reload();
};

// -------------------------------------------------------------------------- //

function getUploadFiles() {
    return $('#files').prop('files');
}

function checkTrackName() {
    window.t ? clearTimeout(window.t) : undefined;

    window.t = setTimeout(
        function() {
            var wsfunc = 'admin.tracks.validate';
            var trackname = $('#trackname').val();
            if(trackname.length === 0) {
                return;
            }
            socket.emit(wsfunc, { track: trackname }, socket.cb);
        }, 500);
}

function uploadTracks() {
    var wsfunc = 'admin.tracks.upload';
    var trackname = $('#trackname').val();
    var reader = new FileReader();
    reader.onload = function(e) {
        var content = e.target.result;
        socket.emit(wsfunc, { track: trackname, ini: content}, socket.cb);
    };
    reader.readAsText(getUploadFiles()[0]);
}

function checkCarName() {
    window.t ? clearTimeout(window.t) : undefined;

    window.t = setTimeout(
        function() {
            var wsfunc = 'admin.cars.validate';
            var carname = $('#carname').val();
            if(carname.length === 0) {
                return;
            }
            socket.emit(wsfunc, { car: carname }, socket.cb);
        }, 500);
}

function uploadCars() {
    var wsfunc = 'admin.cars.upload';
    var carname = $('#carname').val();
    var reader = new FileReader();
    reader.onload = function(e) {
        var content = e.target.result;
        socket.emit(wsfunc, { car: carname, ini: content}, socket.cb);
    };
    reader.readAsText(getUploadFiles()[0]);
}

// -------------------------------------------------------------------------- //

function closeMessageBox() {
    setTimeout(function() {
        $('#messagebox').hide();
    }, 1000);
}