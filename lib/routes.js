var proxy = require('json-proxy');
var fs = require('fs');
var path = require('path');
var authenticate = require('./auth').authenticate;
var authenticateAdmin = require('./auth').authenticateAdmin;
var request = require('request');
var util = require('util');
var auth0Service = require('./auth0_service');
var settingsService = require('./settings_service');
var _ = require('lodash');



module.exports = function(app) {

  /* GET admin page. */
  var mapRouteToIndex = function(route) {

    app.get(route, function(req, res, next) {
      var config = {
        auth0_domain: process.env.AUTH0_DOMAIN,
        auth0_client_id: process.env.AUTH0_CLIENT_ID,
        auth0_connection: process.env.AUTH0_CONNECTION,
        title: process.env.TITLE
      }
      res.render('index', {
        title: config.title,
        config: JSON.stringify(config)
      });
    });
  };

  ['/', '/admin', '/admin/users', '/admin/settings', '/admin/apps', '/admin/roles', '/account'].map(mapRouteToIndex);

  // All requests to the API require authentication
  app.use('/api', authenticate);

  app.get('/api/user/apps', function(req, res) {
    auth0Service.getAppsForUser().then(apps => {
      res.json(apps);
    });
  });

  //app.use('/api', authenticateAdmin);

  app.get('/api/apps', function(req, res) {
    auth0Service.getApps().then(apps => {
      res.json(apps);
    });
  });

  app.post('/api/apps', function(req, res) {
    settingsService.saveClient(req.body).then((client) => {
      res.json(client);
    });
  });

  app.get('/api/roles', function(req, res) {
    settingsService.getRoles()
    .then((roles) => {
      res.json({ roles: roles });
    });
  });

  app.post('/api/roles', function(req, res) {
    settingsService.saveRole(req.body).then((role) => {
      res.json(role);
    });
  });

  app.patch('/api/users/:id', function(req, res) {
    auth0Service.saveUser(req.params.id, req.body).then((user) => {
      res.json(user);
    })
  });

  app.use(proxy.initialize({
    proxy: {
      forward: {
        '/api/proxy/(.*)': 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/$1'
      },
      headers: {
        'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
      }
    }
  }));
};
