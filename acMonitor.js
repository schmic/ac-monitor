var path     = require('path');
var cfg      = require('config');
var passport = require('./libs/passport-steam');
var ac       = require('ac-server-ctrl');

var app      = require('express')();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars',
    require('express-handlebars')({
        defaultLayout: 'main',
        helpers: require('./libs/hbs-helpers')
    })
);

// catch timeouts
app.use(function(req, res, next) {
    req.on('error', function (err) {
        console.error(req.url + ' ' + err.stack);
        res.status(504).send('Connection timeout');
        req.end();
    });
    next();
});

app.use(require('serve-static')(path.join(__dirname, 'public')));

var cookieMiddleware = require('cookie-parser')();
app.use(cookieMiddleware);

var sessionMiddleware = require('express-session')({
    saveUninitialized: false,
    resave: false,
    secret: 'f58e3e18f01ba80ae1472abbd2884b28'
});
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    if(Object.keys(ac.servers).length > 0) {
        req.session.servers = {};
        for(var p in ac.servers) {
            req.session.servers[p] = {
                name: ac.servers[p].name,
                preset: p
            };
        }
    }

    req.session.isAuthenticated = req.user ? true : false;
    req.session.isAdmin = req.user && req.user.isAdmin;

    next();
});

app.use('/', require('./routes/index'));
app.use('/view', require('./routes/view'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));

// Start HTTP-Server with App
//
var server = app.listen(cfg.get('http.port'), function() {
    console.log('acMonitor running at', 'http://' + cfg.http.host + (cfg.http.port !== 80 ? ':'+cfg.http.port : ''));
});

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

io.on('connection', function (socket) {
    console.log('client connected: ', socket.id);

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
    server.on('nextsession', function(session) {
        io.to(server.preset.presetName).emit('render', {
            "server" : {
                "preset": server.preset,
                "session": session
            }
        });
    });
});

ac.on('serverstop', function(server) {
    io.to(server.preset.presetName).emit('stop', { "server": server });
});


// Start Server Watchdog
//
require('./libs/server-watchdog').start();

// Thats bad and ugly but it works for now
//
if(process.env.NODE_ENV !== 'development') {
    process.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err);
    });
}

module.exports = app;
