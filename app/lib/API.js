var request = require('browser-request');
var Dispatcher = require('./Dispatcher');
var Constants = require('./Constants');
var qs = require('querystring');
//var fetch = require('whatwg-fetch');


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

  _postOrPatch: function(method, token, url, options, json, callback) {
    if (options) {
      url + '?' + qs.stringify(options);
    }
    request({
      url: url,
      method: method,
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

  _delete: function(token, url, options, callback) {
    if (options) {
      url + '?' + qs.stringify(options);
    }
    request({
      url: url,
      method: 'DELETE',
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

  _post: function(token, url, options, json, callback) {
    this._postOrPatch('POST', token, url, options, json, callback);
  },

  _patch: function(token, url, options, json, callback) {
    this._postOrPatch('PATCH', token, url, options, json, callback);
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

  saveRole: function(token, role) {
    this._post(token, '/api/roles', null, role, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_ROLE,
        role: data
      });
    })
  },

  deleteRole: function(token, role_id) {
    this._delete(token, '/api/roles/' + role_id, null, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.DELETED_ROLE,
        role_id: role_id
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
    this._get(token, '/api/userprofile', null, function(data) {
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
    this._patch(token, '/api/users/' + user_id, null, body, function(data) {
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
    this._patch(token, '/api/users/' + user_id, null, body, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_USER,
        user: data
      })
    });
  },

  refreshToken: function(token) {

  }
};
