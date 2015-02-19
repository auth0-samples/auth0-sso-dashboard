var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
    auth0_domain: process.env.AUTH0_DOMAIN
  });
});

module.exports = router;
