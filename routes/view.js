var router = require('express').Router();
var ac = require('../libs/server-handler');

router.get('/', function (req, res) {
    res.redirect('/');
});

router.get('/profile', function (req, res) {
    req.session.isAuthenticated ? next() : res.redirect('/');
    res.render('profile', { session: req.session });
});

router.get('/server/:preset', function (req, res) {
    var presetName = req.params.preset;
    var server = ac.servers[presetName];
    res.render('server', { session: req.session, server: server });
});

module.exports = router;
