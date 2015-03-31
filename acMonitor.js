var path = require('path');
var cfg = require('config');
var ac = require('ac-server-ctrl');

var app = require('express')({
    'x-powered-by': false
});
var handlebars = require('express-handlebars')({
    defaultLayout: 'main',
    helpers: require('./libs/hbs-helpers')
});
var passport = require('./libs/passport-steam');
var cookieMiddleware = require('cookie-parser')();
var sessionMiddleware = require('express-session')({
    saveUninitialized: false,
    resave: false,
    secret: 'f58e3e18f01ba80ae1472abbd2884b28'
});
var serveStatic = require('serve-static')(path.join(__dirname, 'public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars);

app.use(function catchTimeout(req, res, next) {
    req.on('error', function (err) {
        console.error(req.url + ' ' + err.stack);
        res.status(504).send('Connection timeout');
        req.end();
    });
    next();
});
app.use(serveStatic);
app.use(cookieMiddleware);
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use(function fillRequestSession(req, res, next) {
    req.session.servers = {};
    for(var p in ac.servers) {
        req.session.servers[p] = {
            name: ac.servers[p].preset.serverName,
            preset: p
        };
    }

    req.session.isAuthenticated = req.user ? true : false;
    req.session.isAdmin = req.user && req.user.isAdmin;

    if(req.headers.host.match(/^localhost/)) {
        req.session.isAdmin = true;
    }

    next();
});

app.use('/', require('./routes/index'));
app.use('/view', require('./routes/view'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/ajax', require('./routes/ajax'));

// Start HTTP-Server with App
//
var httpHost = cfg.get('http.host');
var httpPort = cfg.get('http.port');
console.log('acMonitor running at', 'http://' + httpHost + ':' + httpPort);
var server = app.listen(httpPort, httpHost);

// Start Socket.IO-Listener
//
var io = require('socket.io').listen(server);
io.use(function(socket, next) {
    var req = socket.handshake;
    var res = {};
    cookieMiddleware(req, res, function(err) {
        if (err) return next(err);
        sessionMiddleware(req, res, next);
    });
});

io.on('connection', function registerOnSocket(socket) {
    console.log('client connected: ', socket.id, ' - ', socket.handshake.address);

    if (socket.handshake.address == "127.0.0.1" || socket.handshake.address == "::ffff:127.0.0.1" || socket.handshake.address == "::1") {
        socket.handshake.session.isAdmin = true;
    }

    if(socket.handshake.session.isAdmin) {
        require('./libs/socket-handler-admin')(socket);
    }

    socket.on('disconnect', function() {
        console.log('client disconnected:', socket.id);
    });

    socket.on('view.server', function(presetName) {
        console.log('on.view.server', presetName);
        socket.emit('render', {
            "server" : {
                "preset": ac.servers[presetName].preset,
                "session": ac.servers[presetName].session
            }
        });
        socket.join(presetName);
    });
});

ac.on('serverstart', function(server) {
    server.on('nextsession', function (session) {
        io.to(server.preset.presetName).emit('render', {
            "server": {
                "preset": server.preset,
                "session": session
            }
        });
    });

    server.on('connectcar', function (car) {
        console.log('connectcar', car);
    });

    server.on('disconnectcar', function (car) {
        console.log('disconnectcar', car);
    });

    server.on('lap', function (lap) {
        console.log('lap', lap);
    });
});

ac.on('serverstop', function(server) {
    io.to(server.preset.presetName).emit('stop', {
        "server" : {
            "preset": server.preset
        }
    });
});

// Start Server Watchdog
//
require('./libs/server-watchdog').start();

module.exports = app;

//EOF