let express = require('express');
let router = express.Router();
let passport = require('passport');

let isLoggedIn = require('../config/middleware/isLoggedIn');

router.get('/', function(req, res) {
  const isAuth = req.isAuthenticated();
  res.render('home', {
    title: 'Home page',
    message: req.flash('homeMessage'),
    isAuth: isAuth
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login', {
    title: 'Login page',
    message: req.flash('loginMessage')
  });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/rentals',
  failureRedirect: '/login',
  failureFlash : true
}));

router.get('/signup', function(req, res) {
  res.render('auth/signup', {
    title: 'Sign up page',
    message: req.flash('signupMessage')
  });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/rentals',
  failureRedirect: '/signup',
  failureFlash : true
}));

router.get('/logout', isLoggedIn, function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;