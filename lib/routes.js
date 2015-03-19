var proxy = require('json-proxy');
var fs = require('fs');
var path = require('path');
var authenticate = require('./auth').authenticate;
var authenticateAdmin = require('./auth').authenticateAdmin;
var request = require('request');
var util = require('util');
var appService = require('./app_service');
var settingsService = require('./settings_service');
var _ = require('lodash');



module.exports = function(app) {

  /* GET admin page. */
  var mapRouteToIndex = function(route) {

    app.get(route, function(req, res, next) {
      settingsService.getConfigs(
        'auth0_client_id',
        'auth0_domain',
        'title',
        'default_connection'
      ).then(config => {
        res.render('index', {
          title: config.title,
          config: JSON.stringify(config)
        });
      })

    });
  };

  ['/', '/admin', '/admin/users', '/admin/settings', '/admin/apps', '/admin/roles', '/account'].map(mapRouteToIndex);

  // All requests to the API require authentication
  app.use('/api', authenticate);

  app.get('/api/user/apps', function(req, res) {
    appService.getAppsForUser().then(apps => {
      res.json(apps);
    });
  });

  //app.use('/api', authenticateAdmin);

  app.get('/api/apps', function(req, res) {
    appService.getApps().then(apps => {
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

  app.use(proxy.initialize({
    proxy: {
      forward: {
        '/api/proxy/(.*)': 'https://' + settingsService.getConfig('auth0_domain') + '/api/v2/$1'
      },
      headers: {
        'Authorization': 'Bearer ' + settingsService.getConfig('auth0_api_token')
      }
    }
  }));
};
