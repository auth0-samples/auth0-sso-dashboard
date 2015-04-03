var request = require('browser-request');
var Dispatcher = require('./Dispatcher');
var Constants = require('./Constants');
var qs = require('querystring');

var sbUrlBase = 'https://sandbox.it.auth0.com/api/run/auth0-sso-dashboard?path=';

module.exports = {

  _makeRequest: function(method, token, url, json, callback) {
    var options = {
      method: method,
      url: url,
      headers: {}
    }
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token
    }
    if (json) {
      options.json = json;
    }

    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        if (response.statusCode === 401) {
          Dispatcher.dispatch({
            actionType: Constants.USER_LOGGED_OUT
          });
        }
        console.log({ message: 'Error making HTTP Request', error: error, statusCode: response.statusCode });
        return;
      } else {
        var data;
        if (typeof body === "string") {
          data = JSON.parse(body)
        } else {
          data = body;
        }
        callback(data);
      }
    });
  },

  _get: function(token, url, callback) {
    this._makeRequest('GET', token, url, null, callback);
  },

  _post: function(token, url, json, callback) {
    this._makeRequest('POST', token, url, json, callback);
  },

  _patch: function(token, path, url, callback) {
    this._makeRequest('PATCH', token, url, json, callback);
  },

  _delete: function(token, url, callback) {
    this._makeRequest('DELETE', token, url, null, callback);
  },

  _proxyUrl: function(path, query) {
    var url = sbUrlBase + path;
    if (query) {
      url = url + '&query=' + JSON.stringify(query);
    }
    return url;
  },

  loadUserApps: function(token) {
    var url = this._proxyUrl('/api/user/apps');
    this._get(token, url, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_USER_APPS,
        apps: data
      });
    });
  },

  loadApps: function(token) {
    var url = this._proxyUrl('/api/v2/clients', {"fields": "name,client_id,global"});
    this._get(token, url, function(data) {
      var apps = [];
      for (var i = 0; i < data.length; i++) {
        var app = data[i];
        // Filter out this app and the global 'all applications' app
        if (window.config.auth0_client_id !== app.client_id && app.global === false) {
          // App is allowed, now check permissions
          apps.push(app);
        }
      }
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_APPS,
        apps: apps
      });
    })
  },

  saveApp: function(token, app, callback) {
    this._proxyUrl('/api/v2/clients');
    this._post(token, url, app, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_APP,
        app: data
      });
    })
  },

  loadRoles: function(token) {
    var url = this._proxyUrl('/api/roles');
    this._get(token, url, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_ROLES,
        roles: data.roles
      });
    });
  },

  saveRole: function(token, role) {
    var url = this._proxyUrl('/api/roles');
    this._post(token, url, role, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_ROLE,
        role: data
      });
    })
  },

  deleteRole: function(token, role_id) {
    var url = this._proxyUrl('/api/roles/' + role_id);
    this._delete(token, url, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.DELETED_ROLE,
        role_id: role_id
      });
    })
  },

  loadUsers: function(token, options) {
    var url = this._proxyUrl('/api/v2/users', options)
    this._get(token, url, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_USERS,
        users: data
      });
    });
  },

  loadUserProfile: function(token) {
    var url = 'https://' + window.config.auth0_domain + '/tokeninfo';
    var data = {
      id_token: token
    };
    this._post(null, url, data, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_PROFILE,
        profile: data
      });
    });
  },

  saveUserProfile: function(token, user_id, profile) {
    var body = {
      user_metadata: profile
    }
    var url = this._proxyUrl('/api/userprofile');
    this._patch(token, url, body, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_PROFILE,
        profile: data
      })
    });
  },

  saveUserRoles: function(token, user_id, roles) {
    var body = {
      app_metadata: {
        roles: roles
      }
    }
    var url = this._proxyUrl('/api/users/' + user_id);
    this._patch(token, url, body, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_USER,
        user: data
      })
    });
  },

  refreshToken: function(token) {

  }
};
