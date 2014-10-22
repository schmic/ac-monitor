var router = require('express').Router();
var ac = require('../libs/server-handler');

router.get('/', function (req, res) {
    res.redirect('/');
});

router.get('/profile', function (req, res) {
    if(req.session.isAuthenticated) {
        require('../models/event').list({}, function(err, events) {
            res.render('profile', {
                events: events,
                session: req.session,
                user: req.user
            });
        });
    }
    else {
        res.redirect('/');
    }
});

router.get('/server/:preset', function (req, res) {
    var presetName = req.params.preset;
    var server = ac.servers[presetName];
    res.render('server', { session: req.session, server: server });
});

router.get('/server/:preset/json', function (req, res) {
    var presetName = req.params.preset;
    var server = ac.servers[presetName];
    res.render('api/json', { layout: false, server: server });
});

router.get('/timing/:preset', function (req, res) {
    var presetName = req.params.preset;
    var server = ac.servers[presetName];
    res.render('timing', { session: req.session, server: server });
});

module.exports = router;
