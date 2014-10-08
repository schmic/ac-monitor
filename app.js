#!/usr/bin/env node
var passport = require('./libs/passport-steam');
var path     = require('path');
var cfg      = require('config');
var app      = require('express')();

app.use(require('serve-static')(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars',
    require('express-handlebars')({
        defaultLayout: 'main',
        helpers: require('./libs/hbs-helpers')
    })
);

app.use(require('cookie-parser')());
app.use(require('express-session')({
    saveUninitialized: false,
    resave: false,
    secret: 'f58e3e18f01ba80ae1472abbd2884b28'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    req.session.isAdmin = req.session.passport.user && req.session.passport.user.id === '76561197960428057';
    req.session.isAuthenticated = req.session.passport.user !== undefined;
    next();
});

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));

app.use(function(err, req, res, next) {
    // will print stacktrace
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

var server = app.listen(cfg.get('http.port'), function() {
    console.log('acMonitor running at', 'http://' + cfg.http.host + (cfg.http.port !== 80 ? ':'+cfg.http.port : ''));
});

var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
    console.log('new connection', socket.id);

    socket.on('disconnect', function() {
       console.log('client disconnected', socket.id);
    });

    socket.on('admin.tracks.delete', function(data, fn) {
        console.log('admin.tracks.delete', data);
        socket.send('Track ' + data.track + ' deleted');
    });

});

io.sockets.on('xxx', function(data) {
    console.log('hello xxx');
});

module.exports = app;

// -------------------------------------------------------------------------- //

app.ac = {};
app.ac.servers = {
    // container for running AC servers
};
app.ac.isActive = function isActive(presetName) {
    return Object.keys(app.ac.getServers()).indexOf(presetName) >= 0;
};
app.ac.getPresetNames = function getPresetNames() {
    return Object.keys(app.ac.getServers());
};
app.ac.getServers = function getServers() {
    return app.ac.servers;
};
app.ac.getServer = function getServer(presetName) {
    if(app.ac.isActive(presetName))
        return app.ac.getServers()[presetName];
    return undefined;
};

app.ac.handleExit = function handleExit() {
    var presetName = this.pcfg.presetName;
    console.log('removing dead server:', presetName);
    delete app.ac.servers[presetName];
    broadcastActivePresets();
};

app.ac.handleOutput = function handleOutput(buffer) {
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

app.stopServer = function(presetPrefix) {
    var presetName = cfg.validatePreset(presetPrefix);
    if(app.ac.isActive(presetName))
        app.ac.getServer(presetName).stop();
    else
        console.error('preset is not active:', presetName);
};

app.startServer = function(presetPrefix) {
    var presetName = cfg.validatePreset(presetPrefix);
    if(app.ac.isActive(presetName)) {
        console.error('preset is already active:', presetName);
        return;
    }
    /*
     var acServer = require('./libs/acServer')(presetName);
     acServer.start();
     app.ac.servers[acServer.pcfg.presetName] = acServer;
     acServer.proc.on('exit', app.ac.handleExit.bind(acServer));
     acServer.proc.stdout.on('data', app.ac.handleOutput.bind(acServer));
     acServer.proc.stderr.on('data', app.ac.handleOutput.bind(acServer));
     */
    broadcastActivePresets();
};

// -------------------------------------------------------------------------- //

function broadcastActivePresets() {
    var activePresets = [];
    app.ac.getPresetNames().forEach(function(presetName) {
        activePresets.push({
            presetName: presetName,
            serverName: app.ac.getServer(presetName).pcfg.ini.SERVER.NAME
        });
    });
    io.sockets.broadcast('activePresets', activePresets);
}

function mergeObjects(obj1,obj2){
    var obj3 = {};
    var attrname;
    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}
