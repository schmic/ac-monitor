var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('index', { session: req.session });
});

module.exports = router;
