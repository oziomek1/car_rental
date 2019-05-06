var express = require('express');
var router = express.Router();

/* POST rental check */
router.post('/check', function(req, res, next) {
  var carName = req.body.car;
  var dateStart = req.body.date_start;
  var dateEnd = req.body.date_end;

  res.render('rental', {
    title: 'Checking rental availability',
    carName: carName,
    dateStart: dateStart,
    dateEnd: dateEnd,
  });
});

/* GET rental */
router.get('/', function(req, res, next) {
  var carName = 'Test';
  var dateStart = 'test';
  var dateEnd = 'test';

  res.render('rental', {
    title: 'Showing example rental availability',
    carName: carName,
    dateStart: dateStart,
    dateEnd: dateEnd,
  });
});

module.exports = router;
