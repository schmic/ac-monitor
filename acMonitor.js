var path = require('path');
var cfg = require('config');
var ac = require('ac-server-ctrl');

var app = require('express')();
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

app.disable('x-powered-by');

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

app.use(function setupRequestSession(req, res, next) {
    req.session.servers = {};
    for(var p in ac.servers) {
        if(ac.servers.hasOwnProperty(p)) {
            req.session.servers[p] = {
                name: ac.servers[p].preset.serverName,
                preset: p
            };
        }
    }

    req.session.isAuthenticated = req.user ? true : false;
    req.session.isAdmin = req.user && req.user.isAdmin;

    if(cfg.get('http.adminIPs').indexOf(req.connection.remoteAddress) >= 0) {
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
io.use(function setupSocketSession(socket, next) {
    var req = socket.handshake;
    var res = {};
    cookieMiddleware(req, res, function(err) {
        if (err) {
            return next(err);
        }
        sessionMiddleware(req, res, next);
    });
});

io.use(function setupSocketAdmin(socket, next) {
    if(cfg.get('http.adminIPs').indexOf(socket.handshake.address) >= 0) {
        socket.handshake.session.isAdmin = true;
    }
    next();
});

io.on('connection', function registerOnSocket(socket) {
    require('./libs/socket-handler')(socket);

    if(socket.handshake.session.isAdmin) {
        require('./libs/socket-handler-admin')(socket);
    }
});

ac.on(ac.events.server.start, function(server) {
    server.on(ac.events.session.next, function (session) {
        io.to(server.preset.presetName).emit('render', {
            "server": {
                "preset": server.preset,
                "session": session
            }
        });
    });
});

ac.on(ac.events.server.stop, function(server) {
    io.to(server.preset.presetName).emit(ac.events.server.stop, {
        "server" : {
            "preset": server.preset
        }
    });
});

// Load Plugins
//
if(cfg.has('plugins')) {
    cfg.get('plugins').forEach(function loadPlugin(plugin) {
        require('./libs/plugins/' + plugin);
    });
}

// Load Actions
//
if(cfg.has('actions.pre')) {
    for(var action in cfg.get('actions.pre')) {
        console.info('[action.pre]', action, 'loaded');
        cfg.actions.pre[action] = require('./libs/actions/' + cfg.actions.pre[action]);
    }
}
if(cfg.has('actions.post')) {
    for(var action in cfg.get('actions.post')) {
        console.info('[action.post]', action, 'loaded');
        cfg.actions.post[action] = require('./libs/actions/' + cfg.actions.post[action]);
    }
}

// Start Server Watchdog
//
require('./libs/server-watchdog').start();

module.exports = app;
//EOF