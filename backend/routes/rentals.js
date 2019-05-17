let express = require('express');
let router = express.Router();
let connection = require('../db.js');

let isLoggedIn = require('../config/middleware/isLoggedIn');

let dateStartProposition = null;
let dateEndProposition = null;

/* POST rentals */
router.post('/rentals', isLoggedIn, function(req, res, next) {
  dateStartProposition = req.body.date_start;
  dateEndProposition = req.body.date_end;
  connection.query('SELECT * FROM rentals WHERE rent_start = ?',
      dateStartProposition, function (err, rows, fields) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      res.send({
        title: 'Edit user with id ' + req.params.id,
        id: rows[0].id,
        car_id: rows[0].car_id,
        user_id: rows[0].user_id,
        rent_start: rows[0].rent_start,
        rent_end: rows[0].rent_end,
        price: rows[0].price
      });
    }
  });
  res.redirect('/rentals');
});

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {

  console.log('Req.user', req.user);
  let today = new Date();
  let tommorow = new Date();
  tommorow.setDate(new Date().getDate() + 1);
  res.render('rentals/index', {
    title: 'Rent a car',
    date_start: today.toISOString().slice(0, 10),
    date_end: tommorow.toISOString().slice(0, 10),
  });
});

/* GET RENTALS FIND CARS */

module.exports = router;
