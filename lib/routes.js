var proxy = require('json-proxy');
var fs = require('fs');
var path = require('path');
var authenticate = require('./auth').authenticate;
var authenticateAdmin = require('./auth').authenticateAdmin;
var request = require('request');
var util = require('util');

var samlAddons = ['samlp', 'salesforce_api', 'salesforce_sandbox_api', 'salesforce', 'box', 'concur', 'sharepoint']
var wsFedAddons = ['wsfed'];

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
  // app.use('/api', authenticateAdmin);
  //
  // app.use(proxy.initialize({
  //   proxy: {
  //     forward: {
  //       '/api/(.*)': 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/$1'
  //     },
  //     headers: {
  //       'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
  //     }
  //   }
  // }));

  app.get('/api/apps', function(req, res) {
    request({
      // BUG: https://github.com/auth0/api2/issues/216
      //url: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/clients?fields=name,client_id,addons,global,callbacks',
      url: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/clients',
      headers: {
        'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
      }
    }, function(error, response, body) {
      var apps = JSON.parse(body);

      var filterApps = function(apps) {
        var filtered = [];
        for (var i = 0; i < apps.length; i++) {
          var app = apps[i];
          if (process.env.AUTH0_FILTERED_APPS.indexOf(app.client_id) === -1 &&
              app.global === false /* Global is "All Applications" which we dont want */) {
            // App is allowed, now check permissions
            cleanApp(app);
            filtered.push(app);
          }
        }
        return filtered;
      };

      var getAuthProtocol = function(app) {
        if (app.addons) {
          for (var addon in app.addons) {
            if (samlAddons.indexOf(addon) > -1) {
              return 'samlp';
            } else if (wsFedAddons.indexOf(addon) > -1) {
              return 'ws-fed';
            }
          }
        }

        return 'openid-connect';
      }

      var cleanApp = function(app) {
        var authProtocol = getAuthProtocol(app);
        switch (authProtocol) {
          case 'samlp':
            app.login_url = util.format(
              'https://%s/samlp/%s',
              process.env.AUTH0_DOMAIN,
              app.client_id);
            break;
          case 'ws-fed':
            app.login_url = 'https://ws-fed';
            break;
          case 'openid-connect':
            app.login_url = util.format(
              'https://%s/authorize?response_type=code&scope=openid&client_id=%s&redirect_uri=%s&connection=%s',
              process.env.AUTH0_DOMAIN,
              app.client_id,
              app.callbacks[0], // Select the first callback url, this isn't really ideal though
              process.env.AUTH0_CONNECTION)
            break;
          default:
            throw 'unknown auth protocol';
        }
        delete app.addons;
        delete app.callbacks
      };

      var filteredApps = filterApps(apps);
      res.json(filteredApps);
    });
  });
};
