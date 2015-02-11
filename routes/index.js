var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.render('index', { apps: JSON.stringify(req.user.app || []) });
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res, next) {
  res.locals.clientId = process.env.AUTH0_CLIENT_ID,
  res.locals.auth0Domain = process.env.AUTH0_DOMAIN,
  res.render('login');
});

module.exports = router;
