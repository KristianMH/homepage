var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'About Something it might should be somekind of a system where you can statya' });
});

module.exports = router;
