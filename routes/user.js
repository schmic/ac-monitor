var router = require('express').Router();

function isAuthenticated(req, res, next) {
    req.session.isAuthenticated ? next() : res.redirect('/');
}

router.all('*', isAuthenticated);

router.get('/', function (req, res) {
    res.render('profile', { session: req.session });
});

module.exports = router;
