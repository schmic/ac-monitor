var router = require('express').Router();
var passport = require('../libs/passport-steam');

function isAdmin(session) {
    return session.passport.user.id === '76561197960428057';
}

router.get('/', function (req, res) {
    res.redirect('/user');
});

router.get('/login',
    passport.authenticate('steam', { failureRedirect: '/error' }), function (req, res) {
        // passport does redirect
    });

router.get('/return', passport.authenticate('steam', { failureRedirect: '/error' }), function (req, res) {
    req.session.isAdmin = isAdmin(req.session);
    res.redirect('/user');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
