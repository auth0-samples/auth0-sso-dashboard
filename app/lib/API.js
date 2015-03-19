var request = require('browser-request');
var Dispatcher = require('./Dispatcher');
var Constants = require('./Constants');
var qs = require('querystring');


module.exports = {

  _get: function(token, url, options, callback) {
    if (options) {
      url + '?' + qs.stringify(options);
    }
    request({
      url: url,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        if (response.statusCode === 401) {
          Dispatcher.dispatch({
            actionType: Constants.USER_LOGGED_OUT
          });
        }
        console.log({ message: 'Error making HTTP Request', error: error, statusCode: response.statusCode });
        return;
      } else {
        var data = JSON.parse(body);
        callback(data);
      }
    });
  },

  _post: function(token, url, options, json, callback) {
    if (options) {
      url + '?' + qs.stringify(options);
    }
    request({
      url: url,
      method: 'POST',
      json: json,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        if (response.statusCode === 401) {
          Dispatcher.dispatch({
            actionType: Constants.USER_LOGGED_OUT
          });
        }
        console.log({ message: 'Error making HTTP Request', error: error, statusCode: response.statusCode });
        return;
      } else {
        callback(body);
      }
    });
  },

  loadUserApps: function(token) {
    this._get(token, '/api/user/apps', null, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_USER_APPS,
        apps: data
      });
    });
  },

  loadApps: function(token) {
    this._get(token, '/api/apps', null, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_APPS,
        apps: data
      });
    })
  },

  saveApp: function(token, app, callback) {
    this._post(token, '/api/apps', null, app, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_APP,
        app: data
      });
    })
  },

  loadRoles: function(token) {
    this._get(token, '/api/roles', null, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_ROLES,
        roles: data.roles
      });
    });
  },

  saveRole: function(token, role, callback) {
    this._post(token, '/api/roles', null, role, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_ROLE,
        role: data
      });
    })
  },

  loadUsers: function(token, options) {
    this._get(token, '/api/proxy/users', options, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_USERS,
        users: data
      });
    });
  },

  loadUserProfile: function(token) {
    request({
      url: 'https://' + config.auth0_domain + '/tokeninfo',
      method: 'POST',
      json: {
        id_token: token
      }
    }, function(error, response, data) {
      if (error) {
        throw error;
      } else {
        Dispatcher.dispatch({
          actionType: Constants.RECEIVED_PROFILE,
          profile: data
        });
      }
    });
  },

  refreshToken: function(token) {

  }
};
