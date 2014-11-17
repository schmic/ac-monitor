var path     = require('path');
var cfg      = require('config');
var passport = require('./libs/passport-steam');
var ac       = require('./libs/server-handler');

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
            console.log('server', p);
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
    console.log('new connection', socket.id);

    if(socket.handshake.session.isAdmin) {
        require('./libs/socket-handler-admin')(socket);
    }

    socket.on('disconnect', function() {
        console.log('client disconnected', socket.id);
    });
});

// Server Watchdog
require('./libs/server-watchdog').start();

module.exports = app;

/*** OBSOLETE / UNUSED ***

 ac.handleOutput = function handleOutput(buffer) {
    buffer = buffer.toString('UTF-8');

    var callingRegisterRegExp = /CALLING (http.*\/register.*)/;
    var nextSessionRegExp = /NextSession\nSESSION: ([^\n]+)\nTYPE=(\w+)\nTIME=(\d+)\nLAPS=(\d+)/;
    var carRegExpG = /CAR_\d+\nSESSION_ID:(\d+)\nMODEL: (\w+) .*\]\nDRIVERNAME: (.*)\nGUID:(\d+)/g;
    var carRegExp = /CAR_\d+\nSESSION_ID:(\d+)\nMODEL: (\w+) .*\]\nDRIVERNAME: (.*)\nGUID:(\d+)/;
    var addDriverRegExp = /Adding car: SID:(\d+) name=(.+) model=(.+) skin=(.+) guid=(\d+)/;
    var delDriverRegExp = /Removing car sid:(\d+) name=(.+) model=([^ ]+) guid=(\d+)/;

    // session registers
    if((url = buffer.match(callingRegisterRegExp)) != undefined) {
        var urlSession = require('url').parse(url[1], true).query;
        urlSession.cars = urlSession.cars.split(',');
        this.session = mergeObjects(this.session, urlSession);
        io.sockets.room(this.pcfg.presetName).broadcast('sessionUpdate', this.session);

        console.log('session register:', urlSession);
    }

    // session changes
    else if((matches = buffer.match(nextSessionRegExp)) != undefined) {
        var nextSession = {
            title: matches[1],
            type: matches[2],
            typeBooking: matches[2] == 'BOOK',
            typePractice: matches[2] == 'PRACTICE',
            typeQualify: matches[2] == 'QUALIFY',
            typeRace: matches[2] == 'RACE',
            time: matches[3],
            laps: matches[4],
            endtime: calcSessionEndTime(matches[3])
        };
        this.session = mergeObjects(this.session, nextSession);

        if(nextSession.typeBooking)
            this.session.drivers = this.pcfg.getDriversFromEntryList();

        io.sockets.room(this.pcfg.presetName).broadcast('sessionUpdate', this.session);

        console.log('Session changed to:', this.session.title, '-', this.session.type, nextSession);
        function calcSessionEndTime(duration) {
            var now = new Date();
            now.setMinutes(now.getMinutes() + parseInt(duration));
            return now.toTimeString().split('(')[0];
        }
    }

    else if((matches = buffer.match(addDriverRegExp)) != undefined) {
        var driver = {
            sid: matches[1],
            model: matches[3],
            name: matches[2],
            skin: matches[4],
            guid: matches[5]
        };
        this.session.drivers[driver.sid] = driver;
        io.sockets.room(this.pcfg.presetName).broadcast('sessionUpdate', this.session);
        console.log('driver added:', driver);
    }

    else if((matches = buffer.match(delDriverRegExp)) != undefined) {
        delete this.session.drivers[matches[1]];
        io.sockets.room(this.pcfg.presetName).broadcast('sessionUpdate', this.session);
        console.log('driver removed:', matches);
    }

    else {
        console.log('>>>', buffer, '<<<');
    }
};

***/