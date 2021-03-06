var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

var authRouter = require('./routes/auth');
var rentalsRouter = require('./routes/rentals');
var carsRouter = require('./routes/cars');

var db = require("./models");
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  cookie: { maxAge: 300000 },
  resave: true,
  rolling: true,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

db.sequelize.sync().then(function (){
  console.log('Database sequelize connected')
}).catch(function(err){
  console.log(err,"Something went wrong with the Database sequelize Update!")
});

// routes
app.use('/', authRouter);
app.use('/cars', carsRouter);
app.use('/rentals', rentalsRouter);

let models = require('./models');
require('./config/auth/passport')(passport, models.User);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.env.PORT = 3001;

module.exports = app;
