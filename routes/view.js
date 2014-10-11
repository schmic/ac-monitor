var router = require('express').Router();

function isAuthenticated(req, res, next) {
    req.session.isAuthenticated ? next() : res.redirect('/');
}

router.all('*', isAuthenticated);

router.get('/', function (req, res) {
    res.redirect('/');
});

router.get('/profile', function (req, res) {
    res.render('profile', { session: req.session });
});

router.get('/server/:presetName', function (req, res) {
    var presetName = req.params.presetName;
    res.render('server', { session: req.session });
});

module.exports = router;
