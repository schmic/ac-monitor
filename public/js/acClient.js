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
    if(call.valid) {
        location.reload();
    }
};

Handlebars.getTemplate = function(name, callback) {
    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        if (Handlebars.templates === undefined) {
            Handlebars.templates = {};
        }
        Handlebars.templates[name] = Handlebars.compile($('#'+name).html());
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

Handlebars.registerHelper('remainingTime', function(timestr, duration) {
    var now = new Date();
    var end = new Date(timestr);
    end.setMinutes(end.getMinutes()+duration);
    return ((end-now)/1000/60).toFixed(2);
});

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b)
        return opts.fn(this);
    else
        return opts.inverse(this);
});
