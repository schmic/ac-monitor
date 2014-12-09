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
    console.log('[cb]', call);
    call.reload && location.reload();
};

Handlebars.getTemplate = function(name, callback) {
    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        if (Handlebars.templates === undefined) {
            Handlebars.templates = {};
        }
        $.ajax({
            url : '/templates/' + name + '.hbs',
            async: callback === undefined ? false : true,
                success : function(data) {
                    Handlebars.templates[name] = Handlebars.compile(data);
                    if(callback) {
                        callback(Handlebars.templates[name]);
                    }
                    return Handlebars.templates[name];
                }
        });
    }
    if(callback) {
        callback(Handlebars.templates[name]);
    }
    return Handlebars.templates[name];
};

Handlebars.registerHelper('formatTime', function(timestr) {
    var t = new Date(timestr);
    return t.toTimeString().split(' (').shift();
});
