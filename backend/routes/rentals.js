let express = require('express');
let router = express.Router();
let models = require('../models/');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
let isLoggedIn = require('../config/middleware/isLoggedIn');

let dateStart = null;
let dateEnd = null;

router.get('/all', isLoggedIn, function(req, res, next) {
  models.Rental.findAll().then(function (result) {
    const isAuth = req.isAuthenticated();

    res.render('rentals/show_all_rentals', {
      title: 'Showing all rentals',
      data: result,
      message: req.flash('allRentals'),
      isAuth: isAuth
    });
  });
});

router.get('/rentals', isLoggedIn, function (req, res, next) {
  let message = '';
  models.Rental.findAll({
    where: {
      UserId: req.user.id
    }
  }).then(function (result) {
    if (result.length === 0) {
      message += 'User has no rentals yet'
    }
    const isAuth = req.isAuthenticated();

    res.render('rentals/show_rentals', {
      title: 'Rentals for user with Id ' + req.user.id,
      data: result,
      message: message,
      isAuth: isAuth
    })
  });
});

router.get('/', isLoggedIn, function (req, res, next) {
  let today = new Date();
  let tommorow = new Date();
  tommorow.setDate(new Date().getDate() + 1);
  const isAuth = req.isAuthenticated();
  const isAdmin = isAuth && req.user.isAdmin;
  res.render('rentals/index', {
    title: 'Rent a car',
    dateStart: today.toISOString().slice(0, 10),
    dateEnd: tommorow.toISOString().slice(0, 10),
    message: '',
    isAdmin: isAdmin,
    isAuth: isAuth
  });
});

/* POST rentals */
router.post('/', isLoggedIn, function(req, res, next) {
  dateStart = req.body.dateStart;
  dateEnd = req.body.dateEnd;
  let days = Math.ceil(
      Math.abs(new Date(dateEnd).getTime() - new Date(dateStart).getTime()) /
      (1000 * 3600 * 24));
  models.Rental.findAll({
    // SELECT * FROM rentals WHERE rentStart <= dateStart AND rentStop >= dateStart;
    where: {
      [Op.and]: {
        rentStart: {
          [Op.lte]: dateEnd
        },
        rentEnd: {
          [Op.gte]: dateStart
        }
      }
    }
  }).then(function (result) {
    const isAuth = req.isAuthenticated();
    const isAdmin = isAuth && req.user.isAdmin;
    if (result.length === 0) {
      models.Car.findAll().then(function (result) {
        let prices = [];
        for (var car of result) {
          prices.push(days * car.price);
        }
        res.render('rentals/available_cars', {
          title: 'Showing available cars',
          data: result,
          prices: prices,
          dateStart: dateStart,
          dateEnd: dateEnd,
          message: '',
          isAdmin: isAdmin,
          isAuth: isAuth
        });
      });
    } else {
      let unavailableCars = [];
      for (var rental of result) {
        unavailableCars.push(rental.CarId);
      }
      models.Car.findAll({
        where: {
          id: {
            [Op.notIn]: [...new Set(unavailableCars)]
          }
        }
      }).then(function (nextResult) {
        let prices = [];
        for (var car of nextResult) {
          prices.push(days * car.price);
        }
        res.render('rentals/available_cars', {
          title: 'Showing available cars',
          data: nextResult,
          prices: prices,
          dateStart: dateStart,
          dateEnd: dateEnd,
          message: '',
          isAdmin: isAdmin,
          isAuth: isAuth
        });
      })
    }
  });
});

router.get('/submit/:id', isLoggedIn, function (req, res, next) {
  let rental = {
      rentStart: req.query.dateStart,
      rentEnd: req.query.dateEnd,
      price: req.query.price,
      UserId: req.user.id,
      CarId: req.params.id
  };
  models.Rental.create(rental).then(() => res.redirect('/rentals/rentals'));
});

router.get('/activate/:id', isLoggedIn, function (req, res, next) {
  models.Rental.update({
        status: 1
      }, {
    where: {
      id: req.params.id
    }
  }).then(() => res.redirect('/rentals/all'));
});

module.exports = router;
