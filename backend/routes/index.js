var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var today = new Date();
  var tommorow = new Date();
  tommorow.setDate(new Date().getDate() + 1);
  res.render('index', {
    title: 'Rent a car',
    date_from: today.toISOString().slice(0, 10),
    date_to: tommorow.toISOString().slice(0, 10),
  });
});

module.exports = router;
