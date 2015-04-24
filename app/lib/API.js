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
    this._get(token, '/api/userapps', null, function(data) {
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
    });
  },

  saveApp: function(token, app) {
    this._post(token, '/api/apps', null, app, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_APP,
        app: data
      });
    });
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
    });
  },

  deleteRole: function(token, role_id) {
    this._delete(token, '/api/roles/' + role_id, null, function() {
      Dispatcher.dispatch({
        actionType: Constants.DELETED_ROLE,
        role_id: role_id
      });
    });
  },

  loadUsers: function(token, options) {
    this._get(token, '/api/users', options, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_USERS,
        users: data
      });
    });
  },

  loadTokenInfo: function(token) {
    var url = 'https://' + __AUTH0_DOMAIN__ + '/tokeninfo';
    var data = {
      id_token: token
    };
    this._post(null, url, null, data, function(token_info) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_TOKEN_INFO,
        token_info: token_info
      });
    });
  },

  loadUserProfile: function(token, user_id) {
    user_id = user_id || JSON.parse(atob(token.split('.')[1])).sub;
    var url = 'https://' + __AUTH0_DOMAIN__ + '/api/v2/users/' + user_id + '?exclude_fields=true&fields=app_metadata,identities';
    this._get(token, url, null, function(profile) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_PROFILE,
        profile: profile
      });
    });
  },

  saveUserProfile: function(token, user_id, profile) {
    var body = {
      user_metadata: profile
    };
    var url = 'https://' + __AUTH0_DOMAIN__ + '/api/v2/users/' + user_id;
    this._patch(token, url, null, body, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.RECEIVED_PROFILE,
        profile: data
      });
    });
  },

  saveUserRoles: function(token, user_id, roles) {
    var body = {
      app_metadata: {
        roles: roles
      }
    };
    this._patch(token, '/api/users/' + user_id, null, body, function(data) {
      Dispatcher.dispatch({
        actionType: Constants.SAVED_USER,
        user: data
      });
    });
  },

  refreshToken: function(token) {

  }
};
