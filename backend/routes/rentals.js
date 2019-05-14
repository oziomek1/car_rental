let express = require('express');
let router = express.Router();
let connection = require('../db.js');

let dateStartProposition = null;
let dateEndProposition = null;

/* POST rentals */
router.post('/', function(req, res, next) {
  dateStartProposition = req.body.date_start;
  dateEndProposition = req.body.date_end;
  connection.query('SELECT * FROM rentals WHERE rent_start >= ? AND rent_end <=',
      dateStartProposition, dateEndProposition, function (err, rows, fields) {
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

/* GET rentals */
router.get('/', function(req, res, next) {
  res.render('rentals', {
    title: 'Rent a car - detailed info',
    dateStart: dateStartProposition,
    dateEnd: dateEndProposition,
  });
});

/* GET RENTALS FIND CARS */

module.exports = router;
