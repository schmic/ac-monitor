var router = require('express').Router();
var ac = require('../libs/server-handler');

function isAdmin(req, res, next) {
    req.session.isAdmin ? next() : res.redirect('/');
}

router.all('*', isAdmin);

router.get('/', function(req, res) {
    res.redirect('/admin/index');
});

router.get('/:f', function (req, res) {
    var ctx = { f: {}, session: {}};
    ctx.session = req.session;
    ctx.f[req.params.f] = true;
    ctxHandler[req.params.f](ctx);
    res.render('admin', ctx);
});

var ctxHandler = {};
ctxHandler.index = function(ctx) {};

ctxHandler.servers = function(ctx) {
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
};

ctxHandler.presets = function(ctx) {
    ctx.presets = require('../libs/env').getPresetNames();
};
ctxHandler.tracks = function (ctx) {
    ctx.tracks = require('../libs/env').getTrackNames();
};
ctxHandler.cars = function (ctx) {
    ctx.cars = require('../libs/env').getCarNames();
};

module.exports = router;
