var request = require('request');
var util = require('util');
var nconf = require('nconf');
var _ = require('lodash');


var samlAddons = ['samlp', 'salesforce_api', 'salesforce_sandbox_api', 'salesforce', 'box', 'concur', 'sharepoint']
var wsFedAddons = ['wsfed'];

module.exports = {
  _getAuthProtocol: function(app) {
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
  },

  _cleanApp: function(app) {
    var authProtocol = this._getAuthProtocol(app);
    switch (authProtocol) {
      case 'samlp':
        app.login_url = util.format(
          'https://%s/samlp/%s',
          nconf.get('auth0_domain'),
          app.client_id);
        break;
      case 'ws-fed':
        app.login_url = 'https://ws-fed';
        break;
      case 'openid-connect':
        app.login_url = util.format(
          'https://%s/authorize?response_type=code&scope=openid&client_id=%s&redirect_uri=%s&connection=%s',
          nconf.get('auth0_domain'),
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
    var clients = nconf.get('clients');
    var clientData = _.find(clients, { 'client_id': app.client_id });
    if (clientData) {
      if (clientData.logo_url) {
        app.logo_url = clientData.logo_url;
      }
    }
  },

  _getApps: function(callback) {
    request({
      url: 'https://' + nconf.get('auth0_domain') + '/api/v2/clients?fields=name,client_id,addons,global,callbacks',
      headers: {
        'Authorization': 'Bearer ' + nconf.get('auth0_api_token')
      }
    }, function(error, response, body) {
      var apps = JSON.parse(body);
      callback(error, apps);
    });
  },

  getApps: function(callback) {
    this._getApps((function(err, apps) {
      if (err) {
        callback(err);
      } else {
        apps.map(this._cleanApp);
        callback(null, apps);
      }
    }).bind(this));
  },

  getFilteredApps: function(callback) {
    this._getApps((function(err, apps) {
      if (err) {
        callback(err);
      } else {
        var filtered = [];
        for (var i = 0; i < apps.length; i++) {
          var app = apps[i];
          // Filter our this app and the global 'all applications' app
          if (nconf.get('auth0_client_id') !== app.client_id && app.global === false) {
            // App is allowed, now check permissions
            this._cleanApp(app);
            filtered.push(app);
          }
        }
        callback(null, filtered);
      }
    }).bind(this));
  }
}
