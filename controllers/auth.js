const passport = require('passport');

module.exports = {
  login,
  callback
};

function callback(req, res, next) {
  passport.authenticate(
      'google',
      {
        successRedirect: req.session.originalUrl || req.session.ref || '/',
        failureRedirect: '/auth/login',
      }
  )(req, res, next)
}

function login(req, res, next) {
  const referer = req.headers.referer
  console.log(referer);
  req.session.ref = referer
  passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next)
}

