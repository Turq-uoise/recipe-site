var express = require('express');
var router = express.Router();
const passport = require('passport');
const indexCtrl = require('../controllers/index');
const authCtrl = require('../controllers/auth');

router.get('/', indexCtrl.index);

// Google OAuth login route
router.get('/auth/google', authCtrl.login);

// Google OAuth callback route
router.get('/oauth2callback', authCtrl.callback);

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/');
  });
});

module.exports = router;
