let express = require('express');
let router = express.Router();
let connection = require('../db.js');

/* GET cars listing. */
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

router.get('/details/:id', function(req, res, next) {
  connection.query('SELECT * FROM cars WHERE id = ?', req.params.id, function (err, rows, fields) {
    if (err) {
      res.redirect('/cars')
    } else {
      res.render('users/details', {
        title: 'Car with id ' + req.params.id,
        id: rows[0].id,
        license_plate: rows[0].license_plate,
        car_name: rows[0].car_name,
        price: rows[0].price
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
  let licensePlate = req.body.license_plate;
  let carName = req.body.car_name;
  let price = req.body.price;
  let errors = '';
  if (licensePlate !== '' && carName !== '' && price !== '') {
    licensePlate = licensePlate.trim();
    carName = carName.trim();
    price = price.trim();

    let car = {
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
  connection.query('SELECT * FROM cars WHERE id = ?', req.params.id, function (err, rows, fields) {
    if (err) {
      res.redirect('/cars');
    } else {
      res.render('cars/edit', {
        title: 'Edit car on stock',
        id: rows[0].id,
        license_plate: rows[0].license_plate,
        car_name: rows[0].car_name,
        price: rows[0].price
      });
    }
  });
});

router.post('/edit/:id', function (req, res, next) {
  let licensePlate = req.body.license_plate;
  let carName = req.body.car_name;
  let price = req.body.price;
  let errors = '';
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
  connection.query('DELETE FROM cars WHERE id = ?', req.params.id, function (err, result) {
    if (err) {
      res.redirect('/cars');
    } else {
      res.redirect('/cars');
    }
  });
});

module.exports = router;
