var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('admin', { session: req.session });
});

module.exports = router;
