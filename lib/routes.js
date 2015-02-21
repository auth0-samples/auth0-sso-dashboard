var proxy = require('json-proxy');
var fs = require('fs');
var path = require('path');
var authenticate = require('./auth').authenticate;
var authenticateAdmin = require('./auth').authenticateAdmin;
var request = require('request');

module.exports = function(app) {

  /* GET home page. */
  app.get('/', function(req, res, next) {
    var config = {
      auth0_client_id: process.env.AUTH0_CLIENT_ID,
      auth0_domain: process.env.AUTH0_DOMAIN
    };
    res.render('index', {
      config: JSON.stringify(config)
    });
  });

  // All requests to the API require authentication
  app.use('/api', authenticate);
  app.use('/api', authenticateAdmin);

  app.use(proxy.initialize({
    proxy: {
      forward: {
        '/api/(.*)': 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/$1'
      },
      headers: {
        'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
      }
    }
  }));

  app.get('/data/apps', authenticate, function(req, res) {
    request({
      url: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/clients?fields=name,client_id,addons',
      headers: {
        'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
      }
    }, function(error, response, body) {
      var apps = JSON.parse(body);
      apps.pop(); // the last app is always "All Applications" which we don't want
      res.json(apps);
    });
  });
};
