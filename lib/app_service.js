var request = require('request');
var util = require('util');
var settingsService = require('./settings_service');
var _ = require('lodash');


var samlAddons = ['samlp', 'salesforce_api', 'salesforce_sandbox_api', 'salesforce', 'box', 'concur', 'sharepoint']
var wsFedAddons = ['wsfed'];

class AppService {

  _getAuthProtocol(app) {
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

  _cleanApp(app) {
    return settingsService.getConfig('auth0_domain')
    .then(auth0_domain => {
      var authProtocol = this._getAuthProtocol(app);
      switch (authProtocol) {
        case 'samlp':
          app.login_url = util.format(
            'https://%s/samlp/%s',
            auth0_domain,
            app.client_id);
          break;
        case 'ws-fed':
          app.login_url = 'https://ws-fed';
          break;
        case 'openid-connect':
          app.login_url = util.format(
            'https://%s/authorize?response_type=code&scope=openid&client_id=%s&redirect_uri=%s&connection=%s',
            auth0_domain,
            app.client_id,
            app.callbacks[0], // Select the first callback url, this isn't really ideal though
            process.env.AUTH0_CONNECTION)
          break;
        default:
          throw 'unknown auth protocol';
      }
      delete app.addons;
      delete app.callbacks

      app.logo_url = '/img/logos/auth0.png';
      return settingsService.getClients()
      .then(clients => {
        var clientData = _.find(clients, { 'client_id': app.client_id });
        if (clientData) {
          if (clientData.logo_url) {
            app.logo_url = clientData.logo_url;
          }
        }
        return app;
      });
    });
  }

  _requestApps() {
    return settingsService.getConfigs('auth0_domain', 'auth0_api_token')
    .then(config => {
      return new Promise((resolve, reject) => {
        request({
          url: 'https://' + config.auth0_domain + '/api/v2/clients?fields=name,client_id,addons,global,callbacks',
          headers: {
            'Authorization': 'Bearer ' + config.auth0_api_token
          }
        }, function(error, response, body) {
          if (error) reject(error);
          var apps = JSON.parse(body);
          resolve(apps);
        });
      })
    });
  }

  _getApps(securityTrim) {

    securityTrim = securityTrim || function(apps) { return Promise.resolve(apps); }

    return this._requestApps()
    .then(apps => {
      var p = [];
      for (var i = 0; i < apps.length; i++) {
        var app = apps[i];
        // Filter out this app and the global 'all applications' app
        if (settingsService.getConfig('auth0_client_id') !== app.client_id && app.global === false) {
          // App is allowed, now check permissions
          p.push(this._cleanApp(app));
        }
      }
      return Promise.all(p);
    })
    .then(securityTrim)
    .then(apps => {
      return apps;
    })
  }

  getApps() {
    return this._getApps();
  }

  getAppsForUser() {
    var securityTrim = function(apps) {
      return Promise.resolve(apps);
    }

    return this._getApps(securityTrim);
  }

}

module.exports = new AppService();
