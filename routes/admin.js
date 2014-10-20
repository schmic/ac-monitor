var router = require('express').Router();
var ac = require('../libs/server-handler');
var env = require('../libs/env');
var History = require('../models/history');

function isAccessAllowed (req, res, next) {
    if('development' === app.get('env')) {
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
    var ctx = { f: 'index', session: req.session };
    History.last(undefined, function(err, items) {
        ctx.history = items;
        res.render('admin', ctx);
    });
});

router.get('/servers', function(req, res) {
    var ctx = { f: 'servers', session: req.session };
    ctx.presets = require('../libs/env').getPresetNames();
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
    res.render('admin', ctx);
});

router.get('/presets', function(req, res) {
    var ctx = { f: 'presets', session: req.session };
    ctx.presets = require('../libs/env').getPresetNames();
    res.render('admin', ctx);
});

router.get('/presets/:preset', function (req, res) {
    var ctx = {};
    ctx.session = req.session;
    ctx.preset = require('../libs/preset')(req.params.preset);
    ctx.tracks = env.getTrackNames();
    ctx.cars = env.getCarNames();
    res.render('preset', ctx);
});

router.get('/tracks', function(req, res) {
    var ctx = { f: 'tracks', session: req.session };
    ctx.tracks = require('../libs/env').getTrackNames();
    res.render('admin', ctx);
});

router.get('/cars', function(req, res) {
    var ctx = { f: 'cars', session: req.session };
    ctx.cars = require('../libs/env').getCarNames();
    res.render('admin', ctx);
});

module.exports = router;
