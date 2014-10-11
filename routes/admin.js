var router = require('express').Router();


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
    var acServers = require('../acMonitor').ac.servers;
    var acPresets = require('../libs/env').getPresetNames();
    ctx.servers = [];
    Object.keys(acServers).forEach(function(presetName) {
        if(acServers[presetName].isRunning()) {
            ctx.servers.push({
                preset: presetName,
                name: acServers[presetName].preset.getServerName()
            });
            acPresets.splice(acPresets.indexOf(presetName), 1);
        }
    });
    ctx.presets = acPresets;
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
