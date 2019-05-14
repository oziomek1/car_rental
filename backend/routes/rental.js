var express = require('express');
var router = express.Router();

/* POST rental */
router.post('/', function(req, res, next) {
  var dateFrom = req.body.date_from;
  var dateTo = req.body.date_to;
  res.render('rental', {
    title: 'Rent a car - details',
    dateFrom: dateFrom,
    dateTo: dateTo,
  });
});

/* GET rental */
router.get('/', function(req, res, next) {
  var today = new Date();
  var tommorow = new Date();
  tommorow.setDate(new Date().getDate() + 1);
  res.render('rental', {
    title: 'Rent a car',
    dateFrom: today.toISOString().slice(0, 10),
    dateTo: tommorow.toISOString().slice(0, 10),
  });
});

/* GET RENTAL FIND CARS */

module.exports = router;
