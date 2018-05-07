var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});

router.get('/', function(req, res, next) {
  User
  .findAll()
  .then(function(users) {
    res.render('register', { title: 'User Register', users:users });
  });
});


router.get('/create', function(req, res, next) {
  User.create({'username':'Username', 'password':'Password', 'rol':'rol'})
    .then(function(user) {
      console.log(user);
    });
  var date = new Date();

  res.send(date);
});

router.get('/login', function(req, res, next) {
   if(req.isAuthenticated()) return res.redirect('/');
   res.render('signin', {title: 'Sign In'});
});

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/register',
  failureFlash: true
}));

router.get('/register', function(req, res, next) {
  res.redirect('/users/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/:user_id/destroy', function(req, res, next) {
  User.destroy({
    where: {id: req.params.user_id}
  }).then(function() {
      res.redirect('/users');
    });
});

router.get('/:user_id/profile', function(req, res, next) {
  User
  .find({id: req.params.user_id })
  .then(function(user){
    res.send(user);
  });
});


router.post('/register', function(req, res, next) {
  User.find({username : req.body.username})
  .then(function(user){
      if (!user){
        User.create(req.body)
        .then(function(user) {
            passport.authenticate('local')(req, res, function () {
              res.redirect('/');
            });   
        });
      } else {
        console.log("usuario repetido");
        res.redirect('/users/register');;
      }
  });
});

module.exports = router;
