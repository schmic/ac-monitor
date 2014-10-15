var router = require('express').Router();
var ac = require('../libs/server-handler');
var db = require('../libs/db');

function isAdmin(req, res, next) {
    req.session.isAdmin ? next() : res.redirect('/');
}

router.all('*', isAdmin);

router.get('/', function(req, res) {
    res.redirect('/admin/index');
});

router.get('/index', function (req, res) {
    var ctx = { f: 'index', session: req.session };
    db.history.find().sort('_id', -1).limit(5).toArray(function(err, historyItems) {
        ctx.history = historyItems;
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
    var preset = require('../libs/preset')(req.params.preset);
    res.render('preset', { session: req.session, preset: preset });
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
