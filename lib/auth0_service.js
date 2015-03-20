var request = require('request');
var util = require('util');
var settingsService = require('./settings_service');
var _ = require('lodash');

'use strict';


var samlAddons = ['samlp', 'salesforce_api', 'salesforce_sandbox_api', 'salesforce', 'box', 'concur', 'sharepoint']
var wsFedAddons = ['wsfed'];

class Auth0Service {

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
    var authProtocol = this._getAuthProtocol(app);
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
  }

  _requestApps() {
    return new Promise((resolve, reject) => {
      request({
        url: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/clients?fields=name,client_id,addons,global,callbacks',
        headers: {
          'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
        }
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.log(error);
          reject(error);
        }
        var apps = JSON.parse(body);
        resolve(apps);
      });
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
        if (process.env.AUTH0_CLIENT_ID !== app.client_id && app.global === false) {
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

  saveUser(user_id, user) {
    return new Promise((resolve, reject) => {
      request({
        method: 'PATCH',
        url: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/users/' + user_id,
        headers: {
          'Authorization': 'Bearer ' + process.env.AUTH0_API_TOKEN
        },
        json: user
      }, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.log(error);
          reject(error);
        }
        resolve(body);
      });
    });
  }

}

module.exports = new Auth0Service();
