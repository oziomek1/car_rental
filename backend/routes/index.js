let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let today = new Date();
  let tommorow = new Date();
  tommorow.setDate(new Date().getDate() + 1);
  res.render('index', {
    title: 'Rent a car',
    date_start: today.toISOString().slice(0, 10),
    date_end: tommorow.toISOString().slice(0, 10),
  });
});

module.exports = router;
