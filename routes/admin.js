var router = require('express').Router();

function isAdmin(req, res, next) {
    req.session.isAdmin ? next() : res.redirect('/');
}

router.all('*', isAdmin);

router.get('/', function (req, res) {
    res.render('admin', { session: req.session });
});

module.exports = router;
