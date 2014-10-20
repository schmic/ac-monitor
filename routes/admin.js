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
    res.redirect('/admin/index');
});

router.get('/index', function (req, res) {
    var ctx = { session: req.session };
    History.last(undefined, function(err, items) {
        ctx.history = items;
        res.render('admin/index', ctx);
    });
});

router.get('/servers', function(req, res) {
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
    var ctx = { session: req.session };
    ctx.presets = env.getPresetNames();
    res.render('admin/presets', ctx);
});

router.get('/presets/edit/:preset', function (req, res) {
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
    var ctx = { session: req.session };
    ctx.events = [];
    ctx.presets = env.getPresetNames();
    res.render('admin/events', ctx);
});

router.get('/tracks', function(req, res) {
    var ctx = { session: req.session };
    ctx.tracks = env.getTrackNames();
    res.render('admin/tracks', ctx);
});

router.get('/cars', function(req, res) {
    var ctx = { session: req.session };
    ctx.cars = env.getCarNames();
    res.render('admin/cars', ctx);
});

module.exports = router;
