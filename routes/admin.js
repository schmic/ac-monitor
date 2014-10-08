var router = require('express').Router();

function isAdmin(req, res, next) {
    req.session.isAdmin = true;
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

var ctxHandler = {}
ctxHandler.index = function(ctx) {};

ctxHandler.servers = function(ctx) {};

ctxHandler.presets = function(ctx) {};

ctxHandler.tracks = function (ctx) {
    ctx.tracks = require('../vendor/acCtrl/libs/env').getTrackNames();
};

ctxHandler.cars = function (ctx) {
    ctx.cars = require('../vendor/acCtrl/libs/env').getCarNames();
};

module.exports = router;
