var express = require('express');
var router = express.Router();
var connection = require('../db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM cars ORDER BY id', function (err, rows) {
    if (err) {
      throw err;
    } else {
      res.render('cars', {
        title: 'Showing cars on stock',
        data: rows,
      });
    }
  });
});

router.get('/add', function (req, res, next) {
  res.render('cars/add', {
    title: 'Add new car to stock',
    license_plate: '',
    car_name: '',
    price: '',
    errors: ''
  });
});

router.post('/create', function(req, res, next) {
  var licensePlate = req.body.license_plate;
  var carName = req.body.car_name;
  var price = req.body.price;
  var errors = '';
  if (licensePlate !== '' && carName !== '' && price !== '') {
    licensePlate = licensePlate.trim();
    carName = carName.trim();
    price = price.trim();

    var car = {
      license_plate: licensePlate,
      car_name: carName,
      price: price
    }

    connection.query('INSERT INTO cars SET ?', car, function (err, result) {
      if (err) {
        throw err;
      } else {
        res.redirect('/cars');
      }
    })
  } else {
    errors += 'Some values are empty {Licence plate: ' + licensePlate + ', Car: ' + carName + ', Price: ' + price + '}';
    res.render('cars/add', {
      title: 'Add new car to stock',
      license_plate: req.body.license_plate,
      car_name: req.body.car_name,
      price: req.body.price,
      errors: errors
    });
  }
});

router.get('/edit/:id', function (req, res, next) {
  connection.query('SELECT * FROM cars WHERE id = ', req.params.id, function (err, rows, fields) {
    if (err) {
      res.render('cars/edit', {
        title: 'Edit car on stock',
        id: rows[0].id,
        license_plate: rows[0].license_plate,
        car_name: rows[0].car_name,
        price: rows[0].price
      });
    } else {
      res.redirect('/cars');
    }
  });
});

router.post('/edit/:id', function (req, res, next) {
  var licensePlate = req.body.license_plate;
  var carName = req.body.car_name;
  var price = req.body.price;
  var errors = '';
  if (licensePlate !== '' && carName !== '' && price !== '') {
    licensePlate = licensePlate.trim();
    carName = carName.trim();
    price = price.trim();

    var car = {
      license_plate: licensePlate,
      car_name: carName,
      price: price
    }

    connection.query('UPDATE cars SET ? WHERE id = ' + req.params.id, car, function (err, result) {
      if (err) {
        res.redirect('/cars');
      } else {
        res.redirect('/cars');
      }
    })
  } else {
    errors += 'Some values are empty {Licence plate: ' + licensePlate + ', Car: ' + carName + ', Price: ' + price + '}';
    res.render('cars/edit/', {
      title: 'Add new car to stock',
      id: req.params.id,
      license_plate: req.body.license_plate,
      car_name: req.body.car_name,
      price: req.body.price,
      errors: errors
    });
  }
});

router.get('/delete/:id', function (req, res, next) {
  connection.query('DELETE FROM cars WHERE id = ', req.params.id, function (err, result) {
    if (err) {
      res.redirect('/cars');
    } else {
      res.redirect('/cars');
    }
  });
});

module.exports = router;
