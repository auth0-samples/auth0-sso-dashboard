var proxy = require('json-proxy');
var fs = require('fs');
var path = require('path');
var authenticate = require('./auth').authenticate;
var authenticateAdmin = require('./auth').authenticateAdmin;
var request = require('request');
var util = require('util');
var nconf = require('nconf');
var app_service = require('./app_service');
var _ = require('lodash');

module.exports = function(app) {

  /* GET admin page. */
  var mapRouteToIndex = function(route) {
    app.get(route, function(req, res, next) {
      var config = {
        auth0_client_id: nconf.get('auth0_client_id'),
        auth0_domain: nconf.get('auth0_domain'),
        app_title: nconf.get('title'),
        default_connection: nconf.get('default_connection')
      };
      res.render('index', {
        title: nconf.get('title'),
        config: JSON.stringify(config)
      });
    });
  };

  ['/', '/admin', '/admin/users', '/admin/settings', '/admin/clients', '/admin/roles', '/account'].map(mapRouteToIndex);

  // All requests to the API require authentication
  app.use('/api', authenticate);

  app.get('/api/apps', function(req, res) {
    app_service.getFilteredApps(function(err, apps) {
      if (err) throw err;
      res.json(apps);
    });
  });

  //app.use('/api', authenticateAdmin);

  app.get('/api/roles', function(req, res) {
    var roles = nconf.get('roles');
    res.json({ roles: roles });
  });

  app.use(proxy.initialize({
    proxy: {
      forward: {
        '/api/proxy/(.*)': 'https://' + nconf.get('auth0_domain') + '/api/v2/$1'
      },
      headers: {
        'Authorization': 'Bearer ' + nconf.get('auth0_api_token')
      }
    }
  }));
};
