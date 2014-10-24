var router = require('express').Router();
var ac = require('../libs/server-handler');
var env = require('../libs/env');
var History = require('../models/history');

function isAccessAllowed (req, res, next) {
    if(req.headers.host.match(/^localhost/)) {
        // enable admin interface without authorization
        req.session.isAdmin = true;
    }
    req.session.isAdmin ? next() : res.redirect('/');
}

router.all('*', isAccessAllowed);

router.get('/', function(req, res) {
    res.redirect('/admin/overview');
});

router.get('/overview', function (req, res) {
    req.session.title = 'Overview';
    var ctx = { session: req.session };
    History.last(undefined, function(err, items) {
        ctx.history = items;
        res.render('admin/overview', ctx);
    });
});

router.get('/servers', function(req, res) {
    req.session.title = 'Servers';
    var ctx = { session: req.session };
    ctx.presets = env.getPresetNames();
    ctx.servers = [];
    for(var presetName in ac.servers) {
        var server = ac.servers[presetName];
        if(ac.isRunning(server)) {
            ctx.servers.push({
                preset: server.preset.presetName,
                name: server.name
            });
            ctx.presets.splice(ctx.presets.indexOf(presetName), 1);
        }
    }
    res.render('admin/servers', ctx);
});

router.get('/presets', function(req, res) {
    req.session.title = 'Presets';
    var ctx = { session: req.session };
    ctx.presets = env.getPresetNames();
    res.render('admin/presets', ctx);
});

router.get('/presets/edit/:preset', function (req, res) {
    req.session.title = 'Edit Preset';
    var ctx = {};
    ctx.session = req.session;
    ctx.preset = require('../libs/preset')(req.params.preset);
    res.render('admin/edit/preset', ctx);
});

router.get('/presets/export/:preset', function (req, res) {
    var ctx = {};
    ctx.session = req.session;
    ctx.preset = require('../libs/preset')(req.params.preset);
    ctx.layout = false;
    res.render('api/json', ctx);
});

router.get('/events', function(req, res) {
    req.session.title = 'Events';
    var ctx = { session: req.session };
    ctx.presets = env.getPresetNames();
    require('../models/event').list({}, function(err, events) {
        ctx.events = events;
        res.render('admin/events', ctx);
    });
});

router.get('/events/edit/:event', function(req, res) {
    req.session.title = 'Edit Event';
    var ctx = {};
    ctx.session = req.session;
    require('../models/event').collection.findOne({'slug': req.params.event}, function(err, event) {
        if(err) {
            res.render('error', { message: err });
            return console.error(err);
        }
        ctx.event = event;
        ctx.eventJSON = JSON.stringify(event);
        res.render('admin/edit/event', ctx);
    });
});

router.get('/tracks', function(req, res) {
    req.session.title = 'Tracks';
    var ctx = { session: req.session };
    ctx.tracks = env.getTrackNames();
    res.render('admin/tracks', ctx);
});

router.get('/cars', function(req, res) {
    req.session.title = 'Cars';
    var ctx = { session: req.session };
    ctx.cars = env.getCarNames();
    res.render('admin/cars', ctx);
});

module.exports = router;
