var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var flash = require('connect-flash');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');

var User = require('./models/user');

var app = express();

// Passport config

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.find({ username: username })
    .then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      } else {
          if (user.password != password) {
            return done(null, false, { message: 'Incorrect password.' });
          }  
      }
      return done(null, user);
    });


//   new Model.User({username: username}).fetch().then(function(data) {
//      var user = data;
//      if(user === null) {
//         return done(null, false, {message: 'Invalid username or password'});
//      } else {
//         user = data.toJSON();
//         if(!bcrypt.compareSync(password, user.password)) {
//            return done(null, false, {message: 'Invalid username or password'});
//         } else {
//            return done(null, user);
//         }
//      }
//   });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
 User
  .find({ username: username })
  .then(function(user) {
    done(null, user);
  });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(session({
    secret: 'ssseeecccrrreeettt',
    name: 'ssseeecccrrreeettt',
    //store: sessionStore, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
