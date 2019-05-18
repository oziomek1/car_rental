let express = require('express');
let router = express.Router();
let models = require('../models/');
let isLoggedIn = require('../config/middleware/isLoggedIn');

router.get('/', function(req, res, next) {
  models.Car.findAll().then(function (result) {
    const isAuth = req.isAuthenticated();
    const isAdmin = isAuth && req.user.isAdmin;
    res.render('cars', {
      title: 'Showing cars on stock',
      data: result,
      isAdmin: isAdmin,
      isAuth: isAuth
    });
  });
});

router.get('/details/:id', function(req, res, next) {
  models.Car.findByPk(req.params.id).then(function (result) {
    if(!result) {
      res.redirect('/cars');
    } else {
      const isAuth = req.isAuthenticated();
      const isAdmin = isAuth && req.user.isAdmin;
      res.render('cars/details', {
        title: 'Car details',
        id: req.params.id,
        data: result,
        isAdmin: isAdmin,
        isAuth: isAuth
      });
    }
  });
});

router.get('/add', isLoggedIn, function (req, res, next) {
  const isAuth = req.isAuthenticated();
  const isAdmin = isAuth && req.user.isAdmin;
  res.render('cars/add', {
    title: 'Add new car to stock',
    licensePlate: '',
    make: '',
    model: '',
    price: '',
    imageUrl: '',
    message: '',
    isAdmin: isAdmin,
    isAuth: isAuth
  });
});

router.post('/add', isLoggedIn, function(req, res, next) {
  let licensePlate = req.body.licensePlate;
  let make = req.body.make;
  let model = req.body.model;
  let price = req.body.price;
  let imageUrl = req.body.imageUrl;
  let message = '';
  if (licensePlate !== '' && make !== '' && model !== '' && price !== '') {
      licensePlate = licensePlate.trim();
      make = make.trim();
      model = model.trim();
      price = price.trim();

      let car = {
          licensePlate: licensePlate,
          make: make,
          model: model,
          price: price,
          imageUrl: imageUrl
      };
      models.Car.create(car).then(() => res.redirect('/cars'));
  } else {
      message += 'Some values are empty {Licence plate: ' + licensePlate + ', Make: ' + make + ', Model: ' + model + ', Price: ' + price + '}';
      req.flash(message);
      res.render('cars/add', {
        title: 'Add new car to stock',
        licensePlate: req.body.licensePlate,
        make: req.body.make,
        model: req.body.model,
        price: req.body.price,
        message: message
      });
  }
});

router.get('/edit/:id', isLoggedIn, function (req, res, next) {
  models.Car.findByPk(req.params.id).then(function (result) {
    if (!result) {
      res.redirect('/cars');
    } else {
      const isAuth = req.isAuthenticated();
      res.render('cars/edit', {
        title: 'Edit car on stock',
        id: result.getDataValue('id'),
        licensePlate: result.getDataValue('licensePlate'),
        make: result.getDataValue('make'),
        model: result.getDataValue('model'),
        price: result.getDataValue('price'),
        imageUrl: result.getDataValue('imageUrl'),
        isAuth: isAuth
      });
    }
  });
});

router.post('/edit/:id', isLoggedIn, function (req, res, next) {
  let licensePlate = req.body.licensePlate;
  let make = req.body.make;
  let model = req.body.model;
  let price = req.body.price;
  let imageUrl = req.body.imageUrl;
  let message = '';
  if (licensePlate !== '' && model !== '' &&  make !== '' && price !== '') {
    licensePlate = licensePlate.trim();
    make = make.trim();
    model = model.trim();
    price = price.trim();

    var car = {
      licensePlate: licensePlate,
      make: make,
      model: model,
      price: price,
      imageUrl: imageUrl
    };

    models.Car.update(car,
        {
          where: {
            id: req.params.id
          }
        }).then(() => res.redirect('/cars'));
  } else {
    message += 'Some values are empty {Licence plate: ' + licensePlate + ', Make: ' + make + ', Model: ' + model + ', Price: ' + price + '}';
    req.flash(message);
    res.render('cars/edit', {
      title: 'Add new car to stock',
      id: req.params.id,
      licensePlate: req.body.licensePlate,
      make: req.body.make,
      model: req.body.model,
      price: req.body.price,
      message: message
    });
  }
});

router.get('/delete/:id', isLoggedIn, function (req, res, next) {
  models.Car.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => res.redirect('/cars'));
});

module.exports = router;
