var router = require('express').Router();

router.get('/', function(req, res) {
    req.session.passport.user ? res.redirect('/user/profile') : res.redirect('/');
});

router.get('/profile', function(req, res) {
    res.render('userProfile', { session: req.session });
});

module.exports = router;
