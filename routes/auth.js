var router = require('express').Router();
var passport = require('../libs/passport-steam');

router.get('/', function (req, res) {
    res.redirect('/auth/login');
});

router.get('/login', passport.authenticate('steam', { failureRedirect: '/error' }), function (req, res) {
    // passport does redirect
});

router.get('/return', passport.authenticate('steam', { failureRedirect: '/error' }), function (req, res) {
    res.redirect('/user');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
