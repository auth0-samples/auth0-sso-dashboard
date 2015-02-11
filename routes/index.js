var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    if (!req.user) {
      throw new Error('user null');
    }
    var apps = [];
    if (req.user._json && req.user._json.apps) {
      apps = req.user._json.apps
    }
    res.render('index', {
      apps: JSON.stringify(apps),
      displayName: req.user.displayName,
      picture: req.user.picture || 'https://graph.facebook.com/3/picture'
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/user', function(req, res, next) {
  res.json(req.user);
});

router.get('/login', function(req, res, next) {
  res.locals.clientId = process.env.AUTH0_CLIENT_ID,
  res.locals.auth0Domain = process.env.AUTH0_DOMAIN,
  res.render('login');
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
