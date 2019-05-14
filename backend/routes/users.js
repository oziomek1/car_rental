let express = require('express');
let router = express.Router();
let connection = require('../db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM users ORDER BY id', function (err, rows) {
    if (err) {
      throw err;
    } else {
      res.render('users', {
        title: 'All users',
        data: rows,
      });
    }
  });
});

router.get('/:id', function(req, res, next) {
  connection.query('SELECT * FROM users WHERE id = ?', req.params.id, function (err, rows, fields) {
    if (err) {
      res.redirect('/users')
    } else {
      res.render('users', {
        title: 'User with id ' + req.params.id,
        id: rows[0].id,
        user_name: rows[0].user_name,
        password: '',
        email: rows[0].email
      });
    }
  });
});

router.get('/add', function (req, res, next) {
  res.render('users/add', {
    title: 'Add new user',
    user_name: '',
    password: '',
    email: '',
    errors: ''
  });
});

router.post('/create', function(req, res, next) {
  let userName = req.body.user_name;
  let password = req.body.password;
  let email = req.body.email;
  let errors = '';
  if (userName !== '' && password !== '') {
    userName = userName.trim();
    if (email !== '') {
      email = email.trim();
    }

    let user = {
      user_name: userName,
      password: password,
      email: email
    }

    connection.query('INSERT INTO users SET ?', user, function (err, result) {
      if (err) {
        throw err;
      } else {
        res.redirect('/users');
      }
    })
  } else {
    errors += 'Some values are empty {User name: ' + userName + 'or password is empty}';
    res.render('users/add', {
      title: 'Add new car to stock',
      user_name: req.body.user_name,
      password: req.body.password,
      email: req.body.email,
      errors: errors
    });
  }
});

router.get('/edit/:id', function (req, res, next) {
  connection.query('SELECT * FROM users WHERE id = ?', req.params.id, function (err, rows, fields) {
    if (err) {
      res.redirect('/users');
    } else {
      res.render('users/edit', {
        title: 'Edit user with id ' + req.params.id,
        id: rows[0].id,
        user_name: rows[0].user_name,
        password: '',
        email: rows[0].email
      });
    }
  });
});

router.post('/edit/:id', function (req, res, next) {
  let userName = req.body.user_name;
  let password = req.body.password;
  let email = req.body.email;
  let errors = '';
  if (userName !== '' && password !== '') {
    userName = userName.trim();
    if (email !== '') {
      email = email.trim();
    }

    let user = {
      user_name: userName,
      password: password,
      email: email
    }

    connection.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (err, result) {
      if (err) {
        res.redirect('/users');
      } else {
        res.redirect('/users');
      }
    })
  } else {
    errors += 'Some values are empty {User name: ' + userName + 'or password is empty}';
    res.render('users/edit/', {
      title: 'Edit user with id ' + req.params.id,
      id: rows[0].id,
      user_name: rows[0].user_name,
      password: '',
      email: rows[0].email,
      errors: errors
    });
  }
});

router.get('/delete/:id', function (req, res, next) {
  connection.query('DELETE FROM users WHERE id = ?', req.params.id, function (err, result) {
    if (err) {
      res.redirect('/users');
    } else {
      res.redirect('/users');
    }
  });
});

module.exports = router;
