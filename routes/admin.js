var router = require('express').Router();
var ac = require('ac-server-ctrl');
var cfg = require('config');
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
    History.last(20, function(err, items) {
        if(err) {
            return console.error(err);
        }
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

router.get('/events', function(req, res) {
    req.session.title = 'Events';
    var ctx = { session: req.session };
    ctx.presets = ac.env.getPresetNames();
    ctx.actions = {
        pre: Object.keys(cfg.actions.pre),
        post: Object.keys(cfg.actions.post)
    };
    require('../models/event').getAll(function(err, events) {
        if(err) {
            return console.error(err);
        }
        ctx.events = events;
        res.render('admin/events', ctx);
    });
});

module.exports = router;
