const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Aad user
router.post('/user/add', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];


  if (password != password2) {
    req.flash(
                  'error_msg',
                  'Passwords do not match'
                );
    res.redirect('/dashboard');
  }

  if (password.length < 6) {
     req.flash(
                  'error_msg',
                  'Password must be at least 6 characters'
                );
     res.redirect('/dashboard');
  }

  if (errors.length > 0) {
    res.redirect('/dashboard');
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
          req.flash(
                  'error_msg',
                  'email is already in this system '
                );
          res.redirect('/dashboard');

      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'User succesfully adding'
                );
                res.redirect('/dashboard');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


router.post('/user/edit', (req, res) => {
  const { name, email, id } = req.body;
  let errors = [];

  if (errors.length > 0) {
    res.redirect('/dashboard');
  } else {
   
        const data = {
          name,
          email
         
        };

        User.findOneAndUpdate(
                {
                    _id: id
                },
                data,
                {
                    new: true
                }
            ).then(user => {
                req.flash(
                  'success_msg',
                  'User succesfully edit'
                );
                res.redirect('/dashboard');
              });
          }
});

router.post('/user/delete', (req, res) => {
  const { id } = req.body;

        User.deleteOne(
                {
                    _id: id
                }
            ).then(user => {
                req.flash(
                  'success_msg',
                  'User succesfully deleted'
                );
                res.redirect('/dashboard');
              });
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
