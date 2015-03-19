var router = require('express').Router();
var ac = require('ac-server-ctrl');
var History = require('../models/history');

function isAccessAllowed (req, res, next) {
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
    ctx.presets = ac.env.getPresetNames();
    ctx.servers = [];
    for(var presetName in ac.servers) {
        ac.status(presetName, function(presetName, status) {
            if(status) {
                var server = ac.servers[presetName];
                ctx.servers.push({
                    preset: server.preset.presetName,
                    name: server.preset.serverName
                });
                ctx.presets.splice(ctx.presets.indexOf(presetName), 1);
            }
        });
    }
    res.render('admin/servers', ctx);
});

router.get('/presets', function(req, res) {
    req.session.title = 'Presets';
    var ctx = { session: req.session };
    ctx.presets = ac.env.getPresetNames();
    res.render('admin/presets', ctx);
});

router.get('/presets/edit/:preset', function (req, res) {
    req.session.title = 'Edit Preset';
    var ctx = {};
    ctx.session = req.session;
    ctx.preset = ac.env.getPreset(req.params.preset);
    res.render('admin/edit/preset', ctx);
});

router.get('/presets/export/:preset', function (req, res) {
    var ctx = {};
    ctx.session = req.session;
    ctx.preset = ac.env.getPreset(req.params.preset);
    ctx.layout = false;
    res.render('api/json', ctx);
});

router.get('/tracks', function(req, res) {
    req.session.title = 'Tracks';
    var ctx = { session: req.session };
    ctx.tracks = ac.env.getTrackNames();
    res.render('admin/tracks', ctx);
});

router.get('/cars', function(req, res) {
    req.session.title = 'Cars';
    var ctx = { session: req.session };
    ctx.cars = ac.env.getCarNames();
    res.render('admin/cars', ctx);
});

router.get('/ajax/servers', function(req, res) {
    var servers = [];
    for(var presetName in ac.servers) {
        ac.status(presetName, function(presetName, status) {
            if(status) {
                var server = ac.servers[presetName];
                servers.push({
                    preset: server.preset.presetName,
                    name: server.preset.serverName
                });
            }
        });
    }
    res.json(servers);
});

module.exports = router;
